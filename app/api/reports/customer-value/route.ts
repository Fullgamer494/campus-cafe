import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface CustomerValue {
    customer_id: number;
    customer_name: string;
    customer_email: string;
    num_ordenes: string;
    total_gastado: string;
    gasto_promedio: string;
    ultima_compra: string;
    segmento_cliente: string;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const offset = (page - 1) * limit;

    const [countResult, data] = await Promise.all([
        query<{ total: string }>(`SELECT COUNT(*) as total FROM vw_customer_value`),
        query<CustomerValue>(`SELECT * FROM vw_customer_value ORDER BY total_gastado DESC LIMIT $1 OFFSET $2`, [limit, offset]),
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
