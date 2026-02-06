"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface SalesDaily {
    sale_date: string;
    total_ventas: string;
    tickets: string;
    ticket_promedio: string;
    nivel_ventas: string;
}

export default function SalesDailyPage() {
    const [data, setData] = useState<SalesDaily[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const fetchData = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (dateFrom) params.set("date_from", dateFrom);
        if (dateTo) params.set("date_to", dateTo);

        const res = await fetch(`/api/reports/sales-daily?${params}`);
        const json = await res.json();
        setData(json);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData();
    };

    const handleClear = () => {
        setDateFrom("");
        setDateTo("");
        setTimeout(fetchData, 0);
    };

    const totalVentas = data.reduce((sum, row) => sum + parseFloat(row.total_ventas), 0);
    const totalTickets = data.reduce((sum, row) => sum + parseInt(row.tickets), 0);
    const promedioGeneral = totalTickets > 0 ? totalVentas / totalTickets : 0;

    return (
        <>
            <h1 className="page-title">Ventas diarias</h1>
            <p className="page-description">
                Resumen de ventas agregadas por día. Permite identificar patrones de comportamiento,
                días con mayor actividad y el ticket promedio por jornada.
            </p>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-label">Total vendido</div>
                    <div className="kpi-value">{formatCurrency(totalVentas)}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Total tickets</div>
                    <div className="kpi-value">{totalTickets}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Ticket promedio</div>
                    <div className="kpi-value">{formatCurrency(promedioGeneral)}</div>
                </div>
            </div>

            <form onSubmit={handleFilter}>
                <div className="filters-row">
                    <div className="filter-group">
                        <label>Desde</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label>Hasta</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Filtrar</button>
                    {(dateFrom || dateTo) && (
                        <button type="button" className="btn btn-secondary" onClick={handleClear}>Limpiar</button>
                    )}
                </div>
            </form>

            {loading ? (
                <p className="loading">Cargando datos...</p>
            ) : data.length === 0 ? (
                <p className="loading">No hay datos para el rango seleccionado</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th className="text-right">Total ventas</th>
                            <th className="text-right">Tickets</th>
                            <th className="text-right">Ticket promedio</th>
                            <th>Nivel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.sale_date}>
                                <td>{formatDate(row.sale_date)}</td>
                                <td className="text-right">{formatCurrency(parseFloat(row.total_ventas))}</td>
                                <td className="text-right">{row.tickets}</td>
                                <td className="text-right">{formatCurrency(parseFloat(row.ticket_promedio))}</td>
                                <td>{row.nivel_ventas.charAt(0).toUpperCase() + row.nivel_ventas.slice(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}
