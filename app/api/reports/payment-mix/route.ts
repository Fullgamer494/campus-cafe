import { NextResponse } from "next/server";
import { query } from "@/lib/db";

interface PaymentMix {
    payment_method: string;
    method_display: string;
    num_transacciones: string;
    total_amount: string;
    promedio_transaccion: string;
    percentage: string;
}

interface ChannelSales {
    channel: string;
    channel_display: string;
    num_ordenes: string;
    total_ventas: string;
    ticket_promedio: string;
    porcentaje_ordenes: string;
}

export async function GET() {
    const [payments, channels] = await Promise.all([
        query<PaymentMix>(`SELECT * FROM vw_payment_mix ORDER BY total_amount DESC`),
        query<ChannelSales>(`SELECT * FROM vw_sales_by_channel ORDER BY total_ventas DESC`),
    ]);

    return NextResponse.json({ payments, channels });
}
