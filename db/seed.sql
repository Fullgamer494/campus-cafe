-- =====================================================
-- CAMPUS CAFE - Seed Data
-- Datos de prueba para demostrar filtros y paginacion
-- =====================================================

-- Categorias (5)
INSERT INTO categories (name) VALUES
('Bebidas Calientes'),
('Bebidas Frias'),
('Postres'),
('Comida Rapida'),
('Snacks');

-- Productos (15) - Variedad de stock para demostrar inventario en riesgo
INSERT INTO products (name, category_id, price, stock, min_stock, active) VALUES
-- Bebidas Calientes
('Cafe Americano', 1, 38.00, 150, 20, true),
('Latte', 1, 55.00, 8, 15, true),
('Capuchino', 1, 58.00, 45, 20, true),
('Chocolate Caliente', 1, 52.00, 3, 10, true),
('Te Verde', 1, 35.00, 60, 15, true),
-- Bebidas Frias
('Frappe Moka', 2, 72.00, 25, 10, true),
('Jugo de Naranja', 2, 48.00, 5, 12, true),
('Smoothie de Fresa', 2, 65.00, 18, 8, true),
('Limonada', 2, 38.00, 40, 15, true),
-- Postres
('Pastel de Chocolate', 3, 75.00, 12, 5, true),
('Cheesecake', 3, 72.00, 2, 5, true),
('Brownie', 3, 45.00, 30, 10, true),
-- Comida Rapida
('Sandwich de Jamon', 4, 68.00, 20, 8, true),
('Panini Caprese', 4, 85.00, 6, 8, true),
-- Snacks
('Galletas de Avena', 5, 25.00, 50, 20, true);

-- Clientes (20) - Variedad para demostrar segmentacion
INSERT INTO customers (name, email, created_at) VALUES
('Ana Lopez Garcia', 'ana.lopez@universidad.edu.mx', '2024-08-15 10:00:00'),
('Carlos Ruiz Mendoza', 'carlos.ruiz@universidad.edu.mx', '2024-09-01 11:30:00'),
('Maria Gomez Sanchez', 'maria.gomez@universidad.edu.mx', '2024-09-20 09:15:00'),
('Juan Perez Rodriguez', 'juan.perez@universidad.edu.mx', '2024-10-05 14:00:00'),
('Sofia Martinez Luna', 'sofia.martinez@universidad.edu.mx', '2024-10-18 08:45:00'),
('Diego Hernandez Villa', 'diego.hernandez@universidad.edu.mx', '2024-11-01 12:00:00'),
('Laura Torres Reyes', 'laura.torres@universidad.edu.mx', '2024-11-10 10:30:00'),
('Miguel Angel Castro', 'miguel.castro@universidad.edu.mx', '2024-11-15 15:45:00'),
('Fernanda Rios Morales', 'fernanda.rios@universidad.edu.mx', '2024-11-20 11:20:00'),
('Roberto Silva Diaz', 'roberto.silva@universidad.edu.mx', '2024-12-01 09:00:00'),
('Isabella Vargas Cruz', 'isabella.vargas@universidad.edu.mx', '2024-12-05 13:30:00'),
('Andres Medina Flores', 'andres.medina@universidad.edu.mx', '2024-12-10 16:15:00'),
('Valentina Ortiz Ramos', 'valentina.ortiz@universidad.edu.mx', '2024-12-15 10:45:00'),
('Emmanuel Jimenez Torres', 'emmanuel.jimenez@universidad.edu.mx', '2024-12-20 08:30:00'),
('Camila Rojas Herrera', 'camila.rojas@universidad.edu.mx', '2025-01-02 11:00:00'),
('Sebastian Aguilar Vega', 'sebastian.aguilar@universidad.edu.mx', '2025-01-05 14:20:00'),
('Regina Navarro Paz', 'regina.navarro@universidad.edu.mx', '2025-01-08 09:10:00'),
('Mateo Guzman Olvera', 'mateo.guzman@universidad.edu.mx', '2025-01-10 12:40:00'),
('Paula Espinoza Ruiz', 'paula.espinoza@universidad.edu.mx', '2025-01-12 15:30:00'),
('Nicolas Sandoval Mora', 'nicolas.sandoval@universidad.edu.mx', '2025-01-15 10:50:00');

-- Ordenes (66) distribuidas en varios dias para reportes diarios
INSERT INTO orders (customer_id, created_at, status, channel) VALUES
-- Enero 2025 - Semana 1
(1, '2025-01-06 09:15:00', 'completed', 'in_person'),
(2, '2025-01-06 10:30:00', 'completed', 'app'),
(3, '2025-01-06 11:45:00', 'completed', 'in_person'),
(4, '2025-01-06 14:00:00', 'completed', 'delivery'),
(5, '2025-01-07 08:30:00', 'completed', 'in_person'),
(6, '2025-01-07 09:45:00', 'completed', 'app'),
(7, '2025-01-07 12:15:00', 'completed', 'in_person'),
(8, '2025-01-07 15:30:00', 'completed', 'delivery'),
(9, '2025-01-08 09:00:00', 'completed', 'in_person'),
(10, '2025-01-08 10:20:00', 'completed', 'app'),
(1, '2025-01-08 11:40:00', 'completed', 'in_person'),
(2, '2025-01-08 13:50:00', 'completed', 'delivery'),
(3, '2025-01-09 08:45:00', 'completed', 'in_person'),
(4, '2025-01-09 10:00:00', 'completed', 'app'),
(5, '2025-01-09 12:30:00', 'completed', 'in_person'),
(6, '2025-01-10 09:20:00', 'completed', 'in_person'),
(7, '2025-01-10 11:00:00', 'completed', 'app'),
(8, '2025-01-10 14:15:00', 'completed', 'delivery'),
-- Enero 2025 - Semana 2
(9, '2025-01-13 09:30:00', 'completed', 'in_person'),
(10, '2025-01-13 10:45:00', 'completed', 'app'),
(11, '2025-01-13 12:00:00', 'completed', 'in_person'),
(12, '2025-01-13 15:20:00', 'completed', 'delivery'),
(13, '2025-01-14 08:15:00', 'completed', 'in_person'),
(14, '2025-01-14 09:40:00', 'completed', 'app'),
(15, '2025-01-14 11:30:00', 'completed', 'in_person'),
(16, '2025-01-14 14:00:00', 'completed', 'delivery'),
(17, '2025-01-15 09:00:00', 'completed', 'in_person'),
(18, '2025-01-15 10:30:00', 'completed', 'app'),
(19, '2025-01-15 12:45:00', 'completed', 'in_person'),
(20, '2025-01-15 15:10:00', 'completed', 'delivery'),
(1, '2025-01-16 08:50:00', 'completed', 'in_person'),
(2, '2025-01-16 10:15:00', 'completed', 'app'),
(3, '2025-01-16 11:40:00', 'completed', 'in_person'),
(4, '2025-01-17 09:25:00', 'completed', 'in_person'),
(5, '2025-01-17 11:00:00', 'completed', 'app'),
-- Enero 2025 - Semana 3
(6, '2025-01-20 09:10:00', 'completed', 'in_person'),
(7, '2025-01-20 10:35:00', 'completed', 'app'),
(8, '2025-01-20 12:50:00', 'completed', 'delivery'),
(9, '2025-01-21 08:40:00', 'completed', 'in_person'),
(10, '2025-01-21 10:00:00', 'completed', 'app'),
(11, '2025-01-21 11:25:00', 'completed', 'in_person'),
(12, '2025-01-22 09:15:00', 'completed', 'in_person'),
(13, '2025-01-22 10:45:00', 'completed', 'app'),
(14, '2025-01-22 13:00:00', 'completed', 'delivery'),
(15, '2025-01-23 08:30:00', 'completed', 'in_person'),
(16, '2025-01-23 10:20:00', 'completed', 'app'),
(17, '2025-01-24 09:00:00', 'completed', 'in_person'),
(18, '2025-01-24 11:30:00', 'completed', 'app'),
(19, '2025-01-24 14:45:00', 'completed', 'delivery'),
-- Enero 2025 - Semana 4
(20, '2025-01-27 09:20:00', 'completed', 'in_person'),
(1, '2025-01-27 10:50:00', 'completed', 'app'),
(2, '2025-01-27 12:15:00', 'completed', 'in_person'),
(3, '2025-01-28 08:45:00', 'completed', 'in_person'),
(4, '2025-01-28 10:10:00', 'completed', 'app'),
(5, '2025-01-28 11:35:00', 'completed', 'delivery'),
(6, '2025-01-29 09:05:00', 'completed', 'in_person'),
(7, '2025-01-29 10:30:00', 'completed', 'app'),
(8, '2025-01-30 09:40:00', 'completed', 'in_person'),
(9, '2025-01-30 11:00:00', 'completed', 'app'),
(10, '2025-01-30 13:25:00', 'completed', 'delivery'),
(11, '2025-01-31 08:55:00', 'completed', 'in_person'),
(12, '2025-01-31 10:20:00', 'completed', 'app'),
(13, '2025-01-31 12:40:00', 'completed', 'in_person'),
-- Febrero 2025
(14, '2025-02-03 09:15:00', 'completed', 'in_person'),
(15, '2025-02-03 10:45:00', 'completed', 'app'),
(16, '2025-02-03 12:00:00', 'completed', 'delivery'),
(17, '2025-02-04 08:30:00', 'completed', 'in_person'),
(18, '2025-02-04 10:00:00', 'completed', 'app'),
(19, '2025-02-04 11:30:00', 'completed', 'in_person');

-- Order Items (multiples items por orden para metricas realistas)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
-- Orden 1
(1, 1, 2, 38.00), (1, 10, 1, 75.00),
-- Orden 2
(2, 2, 1, 55.00), (2, 3, 1, 58.00),
-- Orden 3
(3, 6, 2, 72.00), (3, 12, 1, 45.00),
-- Orden 4
(4, 13, 1, 68.00), (4, 1, 3, 38.00),
-- Orden 5
(5, 7, 2, 48.00), (5, 15, 3, 25.00),
-- Orden 6
(6, 1, 1, 38.00), (6, 5, 1, 35.00),
-- Orden 7
(7, 4, 2, 52.00), (7, 11, 1, 72.00),
-- Orden 8
(8, 14, 1, 85.00), (8, 8, 1, 65.00),
-- Orden 9
(9, 1, 2, 38.00), (9, 2, 1, 55.00),
-- Orden 10
(10, 10, 2, 75.00), (10, 3, 1, 58.00),
-- Orden 11
(11, 6, 1, 72.00), (11, 12, 2, 45.00),
-- Orden 12
(12, 9, 2, 38.00), (12, 15, 4, 25.00),
-- Orden 13
(13, 1, 3, 38.00), (13, 4, 1, 52.00),
-- Orden 14
(14, 7, 1, 48.00), (14, 13, 1, 68.00),
-- Orden 15
(15, 2, 2, 55.00), (15, 10, 1, 75.00),
-- Orden 16
(16, 5, 1, 35.00), (16, 8, 2, 65.00),
-- Orden 17
(17, 3, 1, 58.00), (17, 11, 1, 72.00),
-- Orden 18
(18, 14, 2, 85.00), (18, 1, 1, 38.00),
-- Orden 19
(19, 6, 1, 72.00), (19, 12, 1, 45.00),
-- Orden 20
(20, 1, 2, 38.00), (20, 9, 1, 38.00),
-- Orden 21
(21, 2, 1, 55.00), (21, 10, 1, 75.00),
-- Orden 22
(22, 13, 2, 68.00), (22, 7, 1, 48.00),
-- Orden 23
(23, 1, 1, 38.00), (23, 3, 2, 58.00),
-- Orden 24
(24, 8, 1, 65.00), (24, 15, 2, 25.00),
-- Orden 25
(25, 4, 1, 52.00), (25, 11, 1, 72.00),
-- Orden 26
(26, 6, 2, 72.00), (26, 5, 1, 35.00),
-- Orden 27
(27, 14, 1, 85.00), (27, 2, 1, 55.00),
-- Orden 28
(28, 1, 2, 38.00), (28, 12, 1, 45.00),
-- Orden 29
(29, 10, 1, 75.00), (29, 9, 2, 38.00),
-- Orden 30
(30, 3, 1, 58.00), (30, 7, 1, 48.00),
-- Orden 31
(31, 13, 1, 68.00), (31, 1, 1, 38.00),
-- Orden 32
(32, 6, 1, 72.00), (32, 8, 1, 65.00),
-- Orden 33
(33, 2, 2, 55.00), (33, 11, 1, 72.00),
-- Orden 34
(34, 15, 3, 25.00), (34, 4, 1, 52.00),
-- Orden 35
(35, 5, 2, 35.00), (35, 10, 1, 75.00),
-- Orden 36
(36, 1, 1, 38.00), (36, 14, 1, 85.00),
-- Orden 37
(37, 7, 2, 48.00), (37, 3, 1, 58.00),
-- Orden 38
(38, 12, 2, 45.00), (38, 9, 1, 38.00),
-- Orden 39
(39, 6, 1, 72.00), (39, 2, 1, 55.00),
-- Orden 40
(40, 13, 1, 68.00), (40, 8, 1, 65.00),
-- Orden 41
(41, 1, 3, 38.00), (41, 5, 1, 35.00),
-- Orden 42
(42, 10, 1, 75.00), (42, 11, 1, 72.00),
-- Orden 43
(43, 4, 1, 52.00), (43, 15, 2, 25.00),
-- Orden 44
(44, 14, 1, 85.00), (44, 7, 1, 48.00),
-- Orden 45
(45, 2, 1, 55.00), (45, 3, 1, 58.00),
-- Orden 46
(46, 6, 1, 72.00), (46, 12, 1, 45.00),
-- Orden 47
(47, 1, 2, 38.00), (47, 9, 1, 38.00),
-- Orden 48
(48, 13, 1, 68.00), (48, 8, 1, 65.00),
-- Orden 49
(49, 10, 1, 75.00), (49, 5, 1, 35.00),
-- Orden 50
(50, 2, 1, 55.00), (50, 4, 1, 52.00),
-- Orden 51
(51, 6, 2, 72.00), (51, 11, 1, 72.00),
-- Orden 52
(52, 1, 1, 38.00), (52, 14, 1, 85.00),
-- Orden 53
(53, 7, 1, 48.00), (53, 3, 1, 58.00),
-- Orden 54
(54, 12, 1, 45.00), (54, 15, 2, 25.00),
-- Orden 55
(55, 8, 1, 65.00), (55, 9, 1, 38.00),
-- Orden 56
(56, 10, 1, 75.00), (56, 1, 2, 38.00),
-- Orden 57
(57, 6, 1, 72.00), (57, 2, 1, 55.00),
-- Orden 58
(58, 13, 1, 68.00), (58, 5, 1, 35.00),
-- Orden 59
(59, 3, 2, 58.00), (59, 11, 1, 72.00),
-- Orden 60
(60, 14, 1, 85.00), (60, 4, 1, 52.00),
-- Orden 61
(61, 1, 2, 38.00), (61, 8, 1, 65.00),
-- Orden 62
(62, 7, 1, 48.00), (62, 10, 1, 75.00),
-- Orden 63
(63, 6, 1, 72.00), (63, 12, 1, 45.00),
-- Orden 64
(64, 2, 2, 55.00), (64, 15, 3, 25.00),
-- Orden 65
(65, 5, 1, 35.00), (65, 9, 1, 38.00),
-- Orden 66
(66, 1, 1, 38.00), (66, 3, 1, 58.00);

-- Pagos (uno por orden, variedad de metodos)
INSERT INTO payments (order_id, method, paid_amount) VALUES
(1, 'cash', 151.00),
(2, 'card', 113.00),
(3, 'card', 189.00),
(4, 'transfer', 182.00),
(5, 'cash', 171.00),
(6, 'card', 73.00),
(7, 'cash', 176.00),
(8, 'transfer', 150.00),
(9, 'card', 131.00),
(10, 'cash', 208.00),
(11, 'card', 162.00),
(12, 'transfer', 176.00),
(13, 'cash', 166.00),
(14, 'card', 116.00),
(15, 'cash', 185.00),
(16, 'transfer', 165.00),
(17, 'card', 130.00),
(18, 'cash', 208.00),
(19, 'card', 117.00),
(20, 'cash', 114.00),
(21, 'transfer', 130.00),
(22, 'card', 184.00),
(23, 'cash', 154.00),
(24, 'card', 115.00),
(25, 'transfer', 124.00),
(26, 'card', 179.00),
(27, 'cash', 140.00),
(28, 'card', 121.00),
(29, 'transfer', 151.00),
(30, 'card', 106.00),
(31, 'cash', 106.00),
(32, 'card', 137.00),
(33, 'transfer', 182.00),
(34, 'cash', 127.00),
(35, 'card', 145.00),
(36, 'cash', 123.00),
(37, 'card', 154.00),
(38, 'transfer', 128.00),
(39, 'card', 127.00),
(40, 'cash', 133.00),
(41, 'card', 149.00),
(42, 'transfer', 147.00),
(43, 'cash', 102.00),
(44, 'card', 133.00),
(45, 'cash', 113.00),
(46, 'card', 117.00),
(47, 'transfer', 114.00),
(48, 'card', 133.00),
(49, 'cash', 110.00),
(50, 'card', 107.00),
(51, 'card', 216.00),
(52, 'cash', 123.00),
(53, 'transfer', 106.00),
(54, 'card', 95.00),
(55, 'cash', 103.00),
(56, 'card', 151.00),
(57, 'transfer', 127.00),
(58, 'card', 103.00),
(59, 'cash', 188.00),
(60, 'card', 137.00),
(61, 'transfer', 141.00),
(62, 'card', 123.00),
(63, 'cash', 117.00),
(64, 'card', 185.00),
(65, 'transfer', 73.00),
(66, 'card', 96.00);