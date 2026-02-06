"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/formatters";

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

interface ApiResponse {
    data: CustomerValue[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const ITEMS_PER_PAGE = 10;

export default function CustomerValuePage() {
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const fetchData = async (pageNum: number) => {
        setLoading(true);
        const params = new URLSearchParams({
            page: pageNum.toString(),
            limit: ITEMS_PER_PAGE.toString(),
        });

        const res = await fetch(`/api/reports/customer-value?${params}`);
        const json = await res.json();
        setResponse(json);
        setLoading(false);
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const mejorCliente = response?.data[0]?.customer_name || "-";

    return (
        <>
            <h1 className="page-title">Valor del cliente</h1>
            <p className="page-description">
                Segmentación de clientes según su valor de por vida. Los clientes VIP han gastado más de $500,
                los frecuentes entre $250 y $500, y los ocasionales menos de $250.
            </p>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-label">Mejor cliente</div>
                    <div className="kpi-value" style={{ fontSize: "16px" }}>{mejorCliente}</div>
                </div>
            </div>

            {loading ? (
                <p className="loading">Cargando datos...</p>
            ) : !response?.data.length ? (
                <p className="loading">No hay clientes registrados</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Email</th>
                                <th className="text-right">Órdenes</th>
                                <th className="text-right">Total gastado</th>
                                <th className="text-right">Gasto promedio</th>
                                <th>Última compra</th>
                                <th>Segmento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {response.data.map((row) => (
                                <tr key={row.customer_id}>
                                    <td>{row.customer_name}</td>
                                    <td>{row.customer_email}</td>
                                    <td className="text-right">{row.num_ordenes}</td>
                                    <td className="text-right">{formatCurrency(parseFloat(row.total_gastado))}</td>
                                    <td className="text-right">{formatCurrency(parseFloat(row.gasto_promedio))}</td>
                                    <td>{formatDate(row.ultima_compra)}</td>
                                    <td>{row.segmento_cliente}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination-container">
                        <div className="pagination-info">
                            Mostrando {((response.page - 1) * response.limit) + 1} - {Math.min(response.page * response.limit, response.total)} de {response.total} clientes
                        </div>
                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                onClick={() => setPage(p => p - 1)}
                                disabled={page <= 1}
                            >
                                Anterior
                            </button>
                            <span className="pagination-btn active">{page}</span>
                            <button
                                className="pagination-btn"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= (response?.totalPages || 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
