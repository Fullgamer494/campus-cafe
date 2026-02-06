"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

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

interface ApiResponse {
    payments: PaymentMix[];
    channels: ChannelSales[];
}

export default function PaymentMixPage() {
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/reports/payment-mix")
            .then((res) => res.json())
            .then((json) => {
                setResponse(json);
                setLoading(false);
            });
    }, []);

    const metodoPrincipal = response?.payments[0]?.method_display || "-";
    const canalPrincipal = response?.channels[0]?.channel_display || "-";

    return (
        <>
            <h1 className="page-title">Mezcla de pagos</h1>
            <p className="page-description">
                Análisis de la distribución de métodos de pago y canales de venta. Permite entender las
                preferencias de pago de los clientes y los canales más efectivos para el negocio.
            </p>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-label">Método principal</div>
                    <div className="kpi-value" style={{ fontSize: "16px" }}>{metodoPrincipal}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Canal principal</div>
                    <div className="kpi-value" style={{ fontSize: "16px" }}>{canalPrincipal}</div>
                </div>
            </div>

            {loading ? (
                <p className="loading">Cargando datos...</p>
            ) : (
                <>
                    <div className="table-section">
                        <h2 className="table-title">Métodos de pago</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Método</th>
                                    <th className="text-right">Transacciones</th>
                                    <th className="text-right">Total</th>
                                    <th className="text-right">Promedio</th>
                                    <th className="text-right">Porcentaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {response?.payments.map((row) => (
                                    <tr key={row.payment_method}>
                                        <td>{row.method_display}</td>
                                        <td className="text-right">{row.num_transacciones}</td>
                                        <td className="text-right">{formatCurrency(parseFloat(row.total_amount))}</td>
                                        <td className="text-right">{formatCurrency(parseFloat(row.promedio_transaccion))}</td>
                                        <td className="text-right">{formatPercentage(parseFloat(row.percentage))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-section">
                        <h2 className="table-title">Ventas por canal</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Canal</th>
                                    <th className="text-right">Órdenes</th>
                                    <th className="text-right">Total ventas</th>
                                    <th className="text-right">Ticket promedio</th>
                                    <th className="text-right">Porcentaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {response?.channels.map((row) => (
                                    <tr key={row.channel}>
                                        <td>{row.channel_display}</td>
                                        <td className="text-right">{row.num_ordenes}</td>
                                        <td className="text-right">{formatCurrency(parseFloat(row.total_ventas))}</td>
                                        <td className="text-right">{formatCurrency(parseFloat(row.ticket_promedio))}</td>
                                        <td className="text-right">{formatPercentage(parseFloat(row.porcentaje_ordenes))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </>
    );
}
