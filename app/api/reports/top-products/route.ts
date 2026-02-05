import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface TopProduct {
    product_id: number;
    product_name: string;
    category_name: string;
    precio_actual: string;
    total_unidades: string;
    total_revenue: string;
    ranking_revenue: string;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get("limit") || "1000")));
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    let countSql = `SELECT COUNT(*) as total FROM vw_top_products_ranked WHERE 1=1`;
    let dataSql = `SELECT * FROM vw_top_products_ranked WHERE 1=1`;
    const params: (string | number)[] = [];

    if (search.trim()) {
        params.push(`%${search.toLowerCase()}%`);
        countSql += ` AND LOWER(product_name) LIKE $${params.length}`;
        dataSql += ` AND LOWER(product_name) LIKE $${params.length}`;
    }

    dataSql += ` ORDER BY ranking_revenue ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const [countResult, data] = await Promise.all([
        query<{ total: string }>(countSql, params),
        query<TopProduct>(dataSql, [...params, limit, offset]),
    ]);

    const total = parseInt(countResult[0]?.total || "0");

    return NextResponse.json({
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    });
}
