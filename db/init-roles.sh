#!/bin/bash
set -e

# ============================================
# Crear usuario de aplicación con permisos restringidos
# ============================================
# Variables de entorno requeridas:
#   - POSTGRES_USER: superusuario de postgres
#   - POSTGRES_DB: nombre de la base de datos
#   - CAFE_APP_USER: nombre del usuario de la aplicación
#   - CAFE_APP_PASSWORD: contraseña del usuario de la aplicación
# ============================================

echo "Creando usuario de aplicación: $CAFE_APP_USER"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$CAFE_APP_USER') THEN
            EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', '$CAFE_APP_USER', '$CAFE_APP_PASSWORD');
        END IF;
    END \$\$;

    -- Revocar todos los permisos primero
    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM $CAFE_APP_USER;
    
    -- Otorgar permisos mínimos
    GRANT USAGE ON SCHEMA public TO $CAFE_APP_USER;
    
    -- Solo SELECT en las vistas de reportes
    GRANT SELECT ON vw_sales_daily TO $CAFE_APP_USER;
    GRANT SELECT ON vw_top_products_ranked TO $CAFE_APP_USER;
    GRANT SELECT ON vw_inventory_risk TO $CAFE_APP_USER;
    GRANT SELECT ON vw_customer_value TO $CAFE_APP_USER;
    GRANT SELECT ON vw_payment_mix TO $CAFE_APP_USER;
    GRANT SELECT ON vw_sales_by_channel TO $CAFE_APP_USER;
EOSQL

echo "Usuario $CAFE_APP_USER creado con permisos restringidos"
