-- ============================================================================
-- Campus Café - Vistas de reportes
-- ============================================================================

-- ============================================================================
-- VIEW: vw_sales_daily
-- Descripción: Resumen de ventas agregadas por día
-- Grain: Una fila por cada día con ventas completadas
-- Métricas: total_ventas, tickets, ticket_promedio, nivel_ventas
-- 
-- VERIFY: Total de registros por mes
-- SELECT EXTRACT(MONTH FROM sale_date) AS mes, COUNT(*) AS dias_con_ventas
-- FROM vw_sales_daily GROUP BY mes ORDER BY mes;
--
-- VERIFY: Días con ventas altas
-- SELECT COUNT(*) AS dias_altos FROM vw_sales_daily WHERE nivel_ventas = 'alto';
-- ============================================================================
CREATE OR REPLACE VIEW vw_sales_daily AS
SELECT 
    DATE(o.created_at) AS sale_date,
    SUM(oi.quantity * oi.unit_price) AS total_ventas,
    COUNT(DISTINCT o.id) AS tickets,
    ROUND(SUM(oi.quantity * oi.unit_price) / NULLIF(COUNT(DISTINCT o.id), 0), 2) AS ticket_promedio,
    CASE 
        WHEN SUM(oi.quantity * oi.unit_price) >= 500 THEN 'alto'
        WHEN SUM(oi.quantity * oi.unit_price) >= 250 THEN 'medio'
        ELSE 'bajo'
    END AS nivel_ventas
FROM orders o
INNER JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY DATE(o.created_at)
HAVING SUM(oi.quantity * oi.unit_price) > 0
ORDER BY sale_date DESC;

-- ============================================================================
-- VIEW: vw_top_products_ranked
-- Descripción: Ranking de productos por ingresos y unidades vendidas
-- Grain: Una fila por producto activo
-- Métricas: total_unidades, total_revenue, precio_promedio_venta, rankings
-- Window Functions: RANK() para generar rankings de ingresos y unidades
-- 
-- VERIFY: Top 5 productos por ingresos
-- SELECT product_name, total_revenue, ranking_revenue
-- FROM vw_top_products_ranked WHERE ranking_revenue <= 5;
--
-- VERIFY: Productos sin ventas
-- SELECT product_name FROM vw_top_products_ranked WHERE total_revenue = 0;
-- ============================================================================
CREATE OR REPLACE VIEW vw_top_products_ranked AS
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    COALESCE(c.name, 'Sin categoría') AS category_name,
    p.price AS precio_actual,
    COALESCE(SUM(oi.quantity), 0) AS total_unidades,
    COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS total_revenue,
    ROUND(COALESCE(SUM(oi.quantity * oi.unit_price), 0) / NULLIF(COALESCE(SUM(oi.quantity), 0), 0), 2) AS precio_promedio_venta,
    RANK() OVER (ORDER BY COALESCE(SUM(oi.quantity * oi.unit_price), 0) DESC) AS ranking_revenue,
    RANK() OVER (ORDER BY COALESCE(SUM(oi.quantity), 0) DESC) AS ranking_unidades
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.status = 'completed'
WHERE p.active = true
GROUP BY p.id, p.name, c.name, p.price
ORDER BY total_revenue DESC;

-- ============================================================================
-- VIEW: vw_inventory_risk
-- Descripción: Productos con stock bajo o crítico que requieren reposición
-- Grain: Una fila por producto con stock por debajo del mínimo
-- Métricas: stock_percentage, risk_level, unidades_recomendadas_pedir, costo
-- CTE: product_stock_analysis para calcular porcentaje de stock
-- 
-- VERIFY: Contar productos por nivel de riesgo
-- SELECT risk_level, COUNT(*) AS cantidad FROM vw_inventory_risk GROUP BY risk_level;
--
-- VERIFY: Costo total de reposición
-- SELECT SUM(costo_reposicion) AS costo_total FROM vw_inventory_risk;
-- ============================================================================
CREATE OR REPLACE VIEW vw_inventory_risk AS
WITH product_stock_analysis AS (
    SELECT 
        p.id AS product_id,
        p.name AS product_name,
        c.id AS category_id,
        COALESCE(c.name, 'Sin categoría') AS category_name,
        p.stock AS stock_actual,
        p.min_stock,
        p.price,
        CASE 
            WHEN p.min_stock = 0 THEN 100.00
            ELSE ROUND((p.stock::DECIMAL / p.min_stock) * 100, 2)
        END AS stock_percentage
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.active = true
)
SELECT 
    product_id,
    product_name,
    category_id,
    category_name,
    stock_actual,
    min_stock,
    stock_percentage,
    CASE 
        WHEN stock_percentage < 50 THEN 'CRITICO'
        WHEN stock_percentage < 100 THEN 'BAJO'
        ELSE 'NORMAL'
    END AS risk_level,
    CASE 
        WHEN stock_percentage < 50 THEN min_stock * 2 - stock_actual
        WHEN stock_percentage < 100 THEN min_stock - stock_actual
        ELSE 0
    END AS unidades_recomendadas_pedir,
    price * CASE 
        WHEN stock_percentage < 50 THEN min_stock * 2 - stock_actual
        WHEN stock_percentage < 100 THEN min_stock - stock_actual
        ELSE 0
    END AS costo_reposicion
FROM product_stock_analysis
WHERE stock_percentage < 100
ORDER BY stock_percentage ASC;

-- ============================================================================
-- VIEW: vw_customer_value
-- Descripción: Segmentación de clientes por valor de por vida (CLV)
-- Grain: Una fila por cliente con al menos una orden completada
-- Métricas: num_ordenes, total_gastado, gasto_promedio, segmento_cliente
-- HAVING: Filtra solo clientes con órdenes (num_ordenes > 0)
-- 
-- VERIFY: Distribución de clientes por segmento
-- SELECT segmento_cliente, COUNT(*) AS cantidad 
-- FROM vw_customer_value GROUP BY segmento_cliente ORDER BY cantidad DESC;
--
-- VERIFY: Top 3 clientes por gasto
-- SELECT customer_name, total_gastado FROM vw_customer_value LIMIT 3;
-- ============================================================================
CREATE OR REPLACE VIEW vw_customer_value AS
SELECT 
    cu.id AS customer_id,
    cu.name AS customer_name,
    cu.email AS customer_email,
    COUNT(DISTINCT o.id) AS num_ordenes,
    COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS total_gastado,
    ROUND(COALESCE(SUM(oi.quantity * oi.unit_price), 0) / NULLIF(COUNT(DISTINCT o.id), 0), 2) AS gasto_promedio,
    MAX(o.created_at) AS ultima_compra,
    CASE 
        WHEN COALESCE(SUM(oi.quantity * oi.unit_price), 0) >= 500 THEN 'VIP'
        WHEN COALESCE(SUM(oi.quantity * oi.unit_price), 0) >= 250 THEN 'Frecuente'
        WHEN COALESCE(SUM(oi.quantity * oi.unit_price), 0) > 0 THEN 'Ocasional'
        ELSE 'Nuevo'
    END AS segmento_cliente,
    cu.created_at AS cliente_desde
FROM customers cu
LEFT JOIN orders o ON o.customer_id = cu.id AND o.status = 'completed'
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY cu.id, cu.name, cu.email, cu.created_at
HAVING COUNT(DISTINCT o.id) > 0
ORDER BY total_gastado DESC;

-- ============================================================================
-- VIEW: vw_payment_mix
-- Descripción: Distribución de métodos de pago utilizados
-- Grain: Una fila por método de pago
-- Métricas: num_transacciones, total_amount, promedio_transaccion, percentage
-- Window Function: SUM() OVER() para calcular porcentaje del total
-- 
-- VERIFY: Verificar que los porcentajes suman 100
-- SELECT SUM(percentage) AS total_porcentaje FROM vw_payment_mix;
--
-- VERIFY: Método de pago más usado
-- SELECT method_display, num_transacciones FROM vw_payment_mix LIMIT 1;
-- ============================================================================
CREATE OR REPLACE VIEW vw_payment_mix AS
SELECT 
    p.method AS payment_method,
    CASE p.method
        WHEN 'cash' THEN 'Efectivo'
        WHEN 'card' THEN 'Tarjeta'
        WHEN 'transfer' THEN 'Transferencia'
        ELSE 'Otro'
    END AS method_display,
    COUNT(*) AS num_transacciones,
    SUM(p.paid_amount) AS total_amount,
    ROUND(AVG(p.paid_amount), 2) AS promedio_transaccion,
    ROUND((SUM(p.paid_amount) / SUM(SUM(p.paid_amount)) OVER ()) * 100, 2) AS percentage
FROM payments p
INNER JOIN orders o ON o.id = p.order_id
WHERE o.status = 'completed'
GROUP BY p.method
ORDER BY total_amount DESC;

-- ============================================================================
-- VIEW: vw_sales_by_channel
-- Descripción: Análisis de ventas por canal de venta
-- Grain: Una fila por canal de venta
-- Métricas: num_ordenes, total_ventas, ticket_promedio, porcentaje_ordenes
-- Window Function: SUM() OVER() para calcular porcentaje de órdenes
-- 
-- VERIFY: Verificar que los porcentajes suman 100
-- SELECT SUM(porcentaje_ordenes) AS total FROM vw_sales_by_channel;
--
-- VERIFY: Canal con mayor ticket promedio
-- SELECT channel_display, ticket_promedio FROM vw_sales_by_channel 
-- ORDER BY ticket_promedio DESC LIMIT 1;
-- ============================================================================
CREATE OR REPLACE VIEW vw_sales_by_channel AS
SELECT 
    o.channel,
    CASE o.channel
        WHEN 'in_person' THEN 'En persona'
        WHEN 'app' THEN 'Aplicación'
        WHEN 'delivery' THEN 'Delivery'
        ELSE 'Otro'
    END AS channel_display,
    COUNT(DISTINCT o.id) AS num_ordenes,
    SUM(oi.quantity * oi.unit_price) AS total_ventas,
    ROUND(SUM(oi.quantity * oi.unit_price) / NULLIF(COUNT(DISTINCT o.id), 0), 2) AS ticket_promedio,
    ROUND((COUNT(DISTINCT o.id)::DECIMAL / SUM(COUNT(DISTINCT o.id)) OVER ()) * 100, 2) AS porcentaje_ordenes
FROM orders o
INNER JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY o.channel
ORDER BY total_ventas DESC;
