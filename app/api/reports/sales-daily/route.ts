import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface SalesDaily {
    sale_date: string;
    total_ventas: string;
    tickets: string;
    ticket_promedio: string;
    nivel_ventas: string;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    let sql = `SELECT * FROM vw_sales_daily WHERE 1=1`;
    const params: string[] = [];

    if (dateFrom && /^\d{4}-\d{2}-\d{2}$/.test(dateFrom)) {
        params.push(dateFrom);
        sql += ` AND sale_date >= $${params.length}`;
    }
    if (dateTo && /^\d{4}-\d{2}-\d{2}$/.test(dateTo)) {
        params.push(dateTo);
        sql += ` AND sale_date <= $${params.length}`;
    }

    sql += ` ORDER BY sale_date DESC`;

    const data = await query<SalesDaily>(sql, params);
    return NextResponse.json(data);
}
