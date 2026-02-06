import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";

const InventoryRiskSchema = z.object({
    product_id: z.number(),
    product_name: z.string(),
    category_id: z.number(),
    category_name: z.string(),
    stock_actual: z.string(),
    min_stock: z.string(),
    stock_percentage: z.string(),
    risk_level: z.string(),
    unidades_recomendadas_pedir: z.string(),
    costo_reposicion: z.string(),
});

type InventoryRisk = z.infer<typeof InventoryRiskSchema>;

const ALLOWED_CATEGORIES = [1, 2, 3, 4, 5];

const inventorySchema = z.object({
    category_id: z.coerce.number().int().optional().catch(undefined),
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const validated = inventorySchema.safeParse({
        category_id: searchParams.get("category_id") || undefined,
    });

    if (!validated.success) {
        return NextResponse.json({ error: validated.error.issues }, { status: 400 });
    }

    const { category_id } = validated.data;

    let sql = `SELECT * FROM vw_inventory_risk WHERE 1=1`;
    const params: number[] = [];

    if (category_id && ALLOWED_CATEGORIES.includes(category_id)) {
        params.push(category_id);
        sql += ` AND category_id = $${params.length}`;
    }

    sql += ` ORDER BY stock_percentage ASC`;

    const data = await query<InventoryRisk>(sql, params);
    return NextResponse.json(data);
}
