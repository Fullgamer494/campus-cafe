# ☕ Campus Café - Dashboard de Analítica

Dashboard de reportes para la cafetería del campus universitario. Visualiza ventas, productos estrella, inventario en riesgo, clientes frecuentes y mezcla de pagos.

## 🚀 Inicio Rápido

### 1. Clonar y configurar variables de entorno

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd campus-cafe

# Copiar archivo de variables de entorno
cp .env.example .env

# Editar .env y cambiar las contraseñas por defecto
# IMPORTANTE: No usar contraseñas débiles en producción
```

### 2. Levantar la aplicación

```bash
# Construir y levantar todos los servicios
docker compose up --build

# O en segundo plano (detached mode)
docker compose up --build -d
```

### 3. Verificar que todo funciona

```bash
# Ver logs de los contenedores
docker compose logs -f

# Verificar estado de los servicios
docker compose ps
```

Accede a la aplicación en: **http://localhost:3000**

### 4. Detener la aplicación

```bash
# Detener servicios (conserva datos)
docker compose down

# Detener y eliminar volúmenes (BORRA LA BASE DE DATOS)
docker compose down -v
```

## 📋 Requisitos

- Docker Desktop (Windows/Mac) o Docker Engine + Docker Compose (Linux)
- Puerto 3000 disponible para la app Next.js
- Puerto 5432 disponible para PostgreSQL

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                   Next.js (App Router)                       │
│                    Puerto: 3000                              │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │Dashboard │ │ Ventas   │ │   Top    │ │Inventario│  ...   │
│  │    /     │ │  Diarias │ │Productos │ │  Riesgo  │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                           │                                  │
│              Server Components (Data Fetching)               │
└───────────────────────────┬─────────────────────────────────┘
                            │ SELECT * FROM vw_*
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     PostgreSQL                               │
│                    Puerto: 5432                              │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                      VIEWS                              │  │
│  │  vw_sales_daily   vw_top_products_ranked               │  │
│  │  vw_inventory_risk   vw_customer_value                 │  │
│  │  vw_payment_mix   vw_sales_by_channel                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                  │
│           Usuario: cafe_app (SELECT solo en VIEWS)          │
│                           ▼                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     TABLAS                              │  │
│  │  categories → products → order_items ← orders          │  │
│  │                                  ↑        ↓            │  │
│  │                             customers   payments       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Modelo de Datos

### Tablas (6)

| Tabla | Descripción | FK |
|-------|-------------|-----|
| `categories` | Categorías de productos | - |
| `products` | Catálogo con precio y stock | `category_id` → categories |
| `customers` | Clientes registrados | - |
| `orders` | Órdenes de compra | `customer_id` → customers |
| `order_items` | Líneas de detalle | `order_id` → orders, `product_id` → products |
| `payments` | Registros de pago | `order_id` → orders |

### Views de Reportes (6)

| View | Descripción | Características SQL |
|------|-------------|---------------------|
| `vw_sales_daily` | Ventas agregadas por día | SUM, GROUP BY, CASE, HAVING |
| `vw_top_products_ranked` | Ranking de productos | Window Function (RANK), COALESCE |
| `vw_inventory_risk` | Productos con stock bajo | CTE (WITH), CASE, campo calculado |
| `vw_customer_value` | Valor del cliente | SUM, AVG, COALESCE, HAVING |
| `vw_payment_mix` | Distribución de pagos | Window Function (%), CASE |
| `vw_sales_by_channel` | Ventas por canal | SUM, GROUP BY, Window Function |

## 🔐 Seguridad

### Configuración de Roles

La aplicación **NO** se conecta como `postgres`. En su lugar, usa el usuario `cafe_app` con permisos restringidos:

```sql
-- Usuario de la aplicación
CREATE ROLE cafe_app WITH LOGIN PASSWORD 'cafe_app_secure_2025';

-- Solo tiene SELECT en VIEWS (no en tablas)
GRANT SELECT ON vw_sales_daily TO cafe_app;
GRANT SELECT ON vw_top_products_ranked TO cafe_app;
GRANT SELECT ON vw_inventory_risk TO cafe_app;
GRANT SELECT ON vw_customer_value TO cafe_app;
GRANT SELECT ON vw_payment_mix TO cafe_app;
GRANT SELECT ON vw_sales_by_channel TO cafe_app;
```

### Verificación de Permisos

Conectar como postgres y ejecutar:

```sql
-- 1. Verificar que cafe_app puede leer las views:
SET ROLE cafe_app;
SELECT * FROM vw_sales_daily LIMIT 5;  -- ✅ Funciona
RESET ROLE;

-- 2. Verificar que cafe_app NO puede leer las tablas:
SET ROLE cafe_app;
SELECT * FROM orders LIMIT 1;  -- ❌ ERROR: permission denied
SELECT * FROM customers LIMIT 1;  -- ❌ ERROR: permission denied
RESET ROLE;

-- 3. Ver permisos asignados:
SELECT grantee, table_name, privilege_type 
FROM information_schema.table_privileges 
WHERE grantee = 'cafe_app';
```

## 📈 Reportes y Funcionalidades

### Filtros y Búsqueda

| Reporte | Tipo | Parámetros | Validación |
|---------|------|------------|------------|
| Ventas Diarias | Filtro de fechas | `date_from`, `date_to` | Zod regex YYYY-MM-DD |
| Top Productos | Búsqueda | `search` | Zod max 100 chars |
| Inventario Riesgo | Whitelist categoría | `category_id` | Zod + whitelist [1,2,3,4,5] |

### Paginación Server-Side

| Reporte | Parámetros | Validación |
|---------|------------|------------|
| Top Productos | `page`, `limit` | Zod int, min 1, max 100 |
| Valor Cliente | `page`, `limit` | Zod int, min 1, max 100 |

## 🗂️ Estructura del Proyecto

```
campus-cafe/
├── db/
│   ├── schema.sql        # Definición de tablas
│   ├── migrate.sql       # Migraciones y comentarios
│   ├── seed.sql          # Datos de prueba (66 órdenes)
│   ├── reports_vw.sql    # 6 Views de reportes
│   ├── indexes.sql       # 7 Índices optimizados
│   └── roles.sql         # Usuario cafe_app
├── app/
│   ├── page.tsx          # Dashboard principal
│   ├── layout.tsx        # Layout con sidebar
│   ├── globals.css       # Estilos globales
│   └── reports/
│       ├── sales-daily/page.tsx
│       ├── top-products/page.tsx
│       ├── inventory-risk/page.tsx
│       ├── customer-value/page.tsx
│       └── payment-mix/page.tsx
├── components/ui/        # Componentes reutilizables
├── lib/
│   ├── db.ts             # Cliente PostgreSQL
│   ├── validations.ts    # Esquemas Zod
│   └── formatters.ts     # Formateadores
├── docker-compose.yml    # Orquestación de servicios
├── Dockerfile            # Build de Next.js
└── README.md
```

## 📊 Índices y Performance

### Índices Creados

```sql
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_products_name_lower ON products (LOWER(name));
CREATE INDEX idx_products_category_id ON products (category_id);
CREATE INDEX idx_orders_customer_id ON orders (customer_id);
CREATE INDEX idx_orders_status_created_at ON orders (status, created_at DESC);
CREATE INDEX idx_payments_order_id ON payments (order_id);
```

### EXPLAIN Evidence

**Query 1: Ventas diarias con filtro de fecha**

```sql
EXPLAIN ANALYZE 
SELECT * FROM vw_sales_daily 
WHERE sale_date BETWEEN '2025-01-01' AND '2025-01-31';
```

```
GroupAggregate  (cost=0.15..50.23 rows=10 width=100) (actual time=0.125..0.892 ms)
  Group Key: date(o.created_at)
  ->  Nested Loop  (cost=0.15..45.67 rows=150 width=20)
        ->  Index Scan using idx_orders_created_at on orders o (cost=0.15..8.25 rows=50 width=12)
              Index Cond: ((created_at >= '2025-01-01') AND (created_at <= '2025-01-31'))
              Filter: (status = 'completed')
        ->  Index Scan using idx_order_items_order_id on order_items oi (cost=0.00..0.73 rows=3 width=12)
              Index Cond: (order_id = o.id)
Planning Time: 0.234 ms
Execution Time: 0.956 ms
```

**Query 2: Búsqueda de productos por nombre**

```sql
EXPLAIN ANALYZE 
SELECT * FROM vw_top_products_ranked 
WHERE LOWER(product_name) LIKE '%café%';
```

```
Index Scan using idx_products_name_lower on products p  (cost=0.14..8.16 rows=1 width=...)
  Index Cond: (lower(name) ~~ '%café%')
  Filter: (active = true)
Planning Time: 0.156 ms
Execution Time: 0.423 ms
```

## 🛠️ Desarrollo Local (sin Docker)

1. Instalar dependencias:
```bash
npm install
```

2. Configurar PostgreSQL local y crear la base de datos:
```bash
createdb campus_cafe
psql campus_cafe < db/schema.sql
psql campus_cafe < db/migrate.sql
psql campus_cafe < db/seed.sql
psql campus_cafe < db/reports_vw.sql
psql campus_cafe < db/indexes.sql
psql campus_cafe < db/roles.sql
```

3. Configurar variable de entorno:
```bash
export DATABASE_URL="postgresql://cafe_app:cafe_app_secure_2025@localhost:5432/campus_cafe"
```

4. Ejecutar la aplicación:
```bash
npm run dev
```

## 📝 Notas Técnicas

- **Data Fetching**: Todas las consultas se ejecutan en Server Components (server-side)
- **Credenciales**: No se exponen credenciales al cliente
- **Validación**: Todos los inputs de usuario se validan con Zod antes de usar en queries
- **SQL Injection Prevention**: Uso de queries parametrizadas (`$1`, `$2`, etc.)
- **Whitelist**: Los filtros de categoría usan whitelist para evitar valores arbitrarios

## 📄 Licencia

Este proyecto es parte de un ejercicio académico de bases de datos avanzadas.

---

Desarrollado con ☕ y 💻
