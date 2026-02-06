import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";

const CustomerValueSchema = z.object({
    customer_id: z.number(),
    customer_name: z.string(),
    customer_email: z.string().email(),
    num_ordenes: z.string(),
    total_gastado: z.string(),
    gasto_promedio: z.string(),
    ultima_compra: z.string(),
    segmento_cliente: z.string(),
});

type CustomerValue = z.infer<typeof CustomerValueSchema>;

const customerSchema = z.object({
    page: z.coerce.number().min(1).default(1).catch(1),
    limit: z.coerce.number().min(1).max(100).default(10).catch(10),
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const validated = customerSchema.safeParse({
        page: searchParams.get("page"),
        limit: searchParams.get("limit"),
    });

    if (!validated.success) {
        return NextResponse.json({ error: validated.error.issues }, { status: 400 });
    }

    const { page, limit } = validated.data;
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
