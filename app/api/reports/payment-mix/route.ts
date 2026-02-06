import { NextResponse } from "next/server";
import { query } from "@/lib/db";

import { z } from "zod";

const PaymentMixSchema = z.object({
    payment_method: z.string(),
    method_display: z.string(),
    num_transacciones: z.string(),
    total_amount: z.string(),
    promedio_transaccion: z.string(),
    percentage: z.string(),
});

type PaymentMix = z.infer<typeof PaymentMixSchema>;

const ChannelSalesSchema = z.object({
    channel: z.string(),
    channel_display: z.string(),
    num_ordenes: z.string(),
    total_ventas: z.string(),
    ticket_promedio: z.string(),
    porcentaje_ordenes: z.string(),
});

type ChannelSales = z.infer<typeof ChannelSalesSchema>;

export async function GET() {
    const [payments, channels] = await Promise.all([
        query<PaymentMix>(`SELECT * FROM vw_payment_mix ORDER BY total_amount DESC`),
        query<ChannelSales>(`SELECT * FROM vw_sales_by_channel ORDER BY total_ventas DESC`),
    ]);

    return NextResponse.json({ payments, channels });
}
