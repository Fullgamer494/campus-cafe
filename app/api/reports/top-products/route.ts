import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";

const TopProductSchema = z.object({
    product_id: z.coerce.number(),
    product_name: z.coerce.string(),
    category_name: z.coerce.string(),
    precio_actual: z.coerce.string(),
    total_unidades: z.coerce.string(),
    total_revenue: z.coerce.string(),
    ranking_revenue: z.coerce.string(),
});

type TopProduct = z.infer<typeof TopProductSchema>;

const productsSchema = z.object({
    page: z.coerce.number().min(1).default(1).catch(1),
    limit: z.coerce.number().min(1).max(1000).default(1000).catch(1000),
    search: z.string().nullable().optional().transform((val) => val || "").catch(""),
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const validated = productsSchema.safeParse({
        page: searchParams.get("page"),
        limit: searchParams.get("limit"),
        search: searchParams.get("search"),
    });

    if (!validated.success) {
        return NextResponse.json({ error: validated.error.issues }, { status: 400 });
    }

    const { page, limit, search } = validated.data;
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
