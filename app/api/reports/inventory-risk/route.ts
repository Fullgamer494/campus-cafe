import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface InventoryRisk {
    product_id: number;
    product_name: string;
    category_id: number;
    category_name: string;
    stock_actual: string;
    min_stock: string;
    stock_percentage: string;
    risk_level: string;
    unidades_recomendadas_pedir: string;
    costo_reposicion: string;
}

const ALLOWED_CATEGORIES = [1, 2, 3, 4, 5];

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = parseInt(searchParams.get("category_id") || "0");

    let sql = `SELECT * FROM vw_inventory_risk WHERE 1=1`;
    const params: number[] = [];

    if (categoryId && ALLOWED_CATEGORIES.includes(categoryId)) {
        params.push(categoryId);
        sql += ` AND category_id = $${params.length}`;
    }

    sql += ` ORDER BY stock_percentage ASC`;

    const data = await query<InventoryRisk>(sql, params);
    return NextResponse.json(data);
}
