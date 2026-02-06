import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";

const SalesDailySchema = z.object({
    sale_date: z.string(),
    total_ventas: z.string(),
    tickets: z.string(),
    ticket_promedio: z.string(),
    nivel_ventas: z.string(),
});

type SalesDaily = z.infer<typeof SalesDailySchema>;

const salesSchema = z.object({
    date_from: z.string().date().optional(),
    date_to: z.string().date().optional(),
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const validated = salesSchema.safeParse({
        date_from: searchParams.get("date_from") || undefined,
        date_to: searchParams.get("date_to") || undefined,
    });

    if (!validated.success) {
        return NextResponse.json({ error: validated.error.issues }, { status: 400 });
    }

    const { date_from, date_to } = validated.data;

    let sql = `SELECT * FROM vw_sales_daily WHERE 1=1`;
    const params: string[] = [];

    if (date_from) {
        params.push(date_from);
        sql += ` AND sale_date >= $${params.length}`;
    }
    if (date_to) {
        params.push(date_to);
        sql += ` AND sale_date <= $${params.length}`;
    }

    sql += ` ORDER BY sale_date DESC`;

    const data = await query<SalesDaily>(sql, params);
    return NextResponse.json(data);
}
