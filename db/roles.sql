-- Crear usuario usando variable de entorno CAFE_APP_PASSWORD
-- En Docker, esta variable se pasa al contenedor
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'cafe_app') THEN
        EXECUTE format('CREATE ROLE cafe_app WITH LOGIN PASSWORD %L', 
            current_setting('env.cafe_app_password', true));
    END IF;
END $$;

-- Permisos sobre VIEWS (solo SELECT)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM cafe_app;
GRANT USAGE ON SCHEMA public TO cafe_app;

GRANT SELECT ON vw_sales_daily TO cafe_app;
GRANT SELECT ON vw_top_products_ranked TO cafe_app;
GRANT SELECT ON vw_inventory_risk TO cafe_app;
GRANT SELECT ON vw_customer_value TO cafe_app;
GRANT SELECT ON vw_payment_mix TO cafe_app;
GRANT SELECT ON vw_sales_by_channel TO cafe_app;
