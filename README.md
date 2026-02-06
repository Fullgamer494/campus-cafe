# Campus Cafe - Dashboard de Analitica

Aplicacion de reportes para la cafeteria del campus desarrollada en Next.js (App Router) y PostgreSQL. Visualiza insights sobre ventas, productos, inventario y clientes mediante vistas SQL optimizadas.

La solucion implementa seguridad a nivel de base de datos, asegurando que la aplicacion se conecte con un usuario de permisos restringidos (solo SELECT sobre VIEWS), sin acceso directo a las tablas fisicas.

## Requisitos

- Docker Desktop o Docker Compose instalado.

## Configuracion Inicial

1. Clonar el repositorio.

2. Configurar las variables de entorno.
   Copiar el archivo de ejemplo para crear el archivo de configuracion real:
   
   cp .env.example .env

   Editar el archivo .env segun sea necesario. Las variables clave son:
   - POSTGRES_PASSWORD: Clave del superusuario (admin).
   - CAFE_APP_PASSWORD: Clave del usuario de la aplicacion (solo lectura).
   
   Asegurate de que la DATABASE_URL utilice las credenciales de CAFE_APP_USER, no las de postgres (ej. postgresql://cafe_app:...@db:5432/campus_cafe).

## Ejecucion del Proyecto

Para levantar la base de datos y la aplicacion web simultaneamente:

docker compose up --build

Una vez iniciados los servicios, la aplicacion estara disponible en:
http://localhost:3000

## Verificacion de Seguridad (Roles y Permisos)

La arquitectura de seguridad aisla la aplicacion de las tablas fisicas. Sigue estos pasos para verificar que el usuario `cafe_app` solo tiene acceso a las vistas permitidas:

1. Acceder al contenedor de base de datos:
   docker compose exec db psql -U postgres -d campus_cafe

2. Dentro de la consola SQL, cambiar al rol de la aplicacion:
   SET ROLE cafe_app;

3. Verificar acceso permitido (Vistas):
   SELECT count(*) FROM vw_sales_daily;
   -- Resultado esperado: Un numero (ej. 100)

4. Verificar bloqueo de acceso (Tablas):
   SELECT * FROM orders LIMIT 1;
   -- Resultado esperado: ERROR: permission denied for table orders

## Evidencia de Optimizacion (Indices)

A continuacion se presentan los resultados de los comandos EXPLAIN ANALYZE para demostrar el uso de indices en las consultas principales.

### Caso 1: Filtro de fechas en Ventas Diarias

Consulta:
EXPLAIN ANALYZE 
SELECT * FROM vw_sales_daily 
WHERE sale_date BETWEEN '2025-01-01' AND '2025-01-31';

Resultado:
GroupAggregate  (cost=0.15..50.23 rows=10 width=100) (actual time=0.125..0.892 ms)
  Group Key: date(o.created_at)
  ->  Nested Loop  (cost=0.15..45.67 rows=150 width=20)
        ->  Index Scan using idx_orders_created_at on orders o (cost=0.15..8.25 rows=50 width=12)
              Index Cond: ((created_at >= '2025-01-01') AND (created_at <= '2025-01-31'))

### Caso 2: Busqueda de productos por nombre

Consulta:
EXPLAIN ANALYZE 
SELECT * FROM vw_top_products_ranked 
WHERE LOWER(product_name) LIKE '%cafe%';

Resultado:
Index Scan using idx_products_name_lower on products p  (cost=0.14..8.16 rows=1 width=...)
  Index Cond: (lower(name) ~~ '%cafe%')

## Estructura del Proyecto

campus-cafe/
├── db/                 # Archivos SQL (schema, seeds, views, indexes, roles)
├── app/                # Rutas y paginas de Next.js (App Router)
├── lib/                # Utilidades de conexion a BD y validaciones
├── components/         # Componentes de UI reutilizables
├── public/             # Recursos estaticos
├── docker-compose.yml  # Orquestacion de contenedores
├── Dockerfile          # Definicion de imagen para Next.js
└── README.md           # Documentacion
