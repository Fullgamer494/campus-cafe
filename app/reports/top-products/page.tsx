"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/formatters";

interface TopProduct {
    product_id: number;
    product_name: string;
    category_name: string;
    precio_actual: string;
    total_unidades: string;
    total_revenue: string;
    ranking_revenue: string;
}

interface ApiResponse {
    data: TopProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const ITEMS_PER_PAGE = 10;

export default function TopProductsPage() {
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const fetchData = async (pageNum: number, searchTerm: string) => {
        setLoading(true);
        const params = new URLSearchParams({
            page: pageNum.toString(),
            limit: ITEMS_PER_PAGE.toString(),
        });
        if (searchTerm) params.set("search", searchTerm);

        const res = await fetch(`/api/reports/top-products?${params}`);
        const json = await res.json();
        setResponse(json);
        setLoading(false);
    };

    useEffect(() => {
        fetchData(page, search);
    }, [page, search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const handleClear = () => {
        setSearchInput("");
        setSearch("");
        setPage(1);
    };

    const totalRevenue = response?.data?.reduce((sum, row) => sum + parseFloat(row.total_revenue), 0) || 0;
    const topProduct = response?.data?.[0]?.product_name || "-";

    return (
        <>
            <h1 className="page-title">Top productos</h1>
            <p className="page-description">
                Ranking de productos ordenados por ingresos generados. Permite identificar los productos
                estrella del negocio y aquellos que más contribuyen a la facturación.
            </p>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-label">Producto estrella</div>
                    <div className="kpi-value" style={{ fontSize: "16px" }}>{topProduct}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Total productos</div>
                    <div className="kpi-value">{response?.total || 0}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Ingresos en página</div>
                    <div className="kpi-value">{formatCurrency(totalRevenue)}</div>
                </div>
            </div>

            <form onSubmit={handleSearch}>
                <div className="filters-row">
                    <div className="filter-group">
                        <label>Buscar producto</label>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Ej: café, croissant..."
                            style={{ minWidth: "250px" }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Buscar</button>
                    {search && (
                        <button type="button" className="btn btn-secondary" onClick={handleClear}>Limpiar</button>
                    )}
                </div>
            </form>

            {loading ? (
                <p className="loading">Cargando datos...</p>
            ) : !response?.data || response.data.length === 0 ? (
                <p className="loading">No se encontraron productos o hubo un error al cargar.</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Ranking</th>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th className="text-right">Precio actual</th>
                                <th className="text-right">Unidades vendidas</th>
                                <th className="text-right">Ingresos totales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {response.data.map((row) => (
                                <tr key={row.product_id}>
                                    <td>#{row.ranking_revenue}</td>
                                    <td>{row.product_name}</td>
                                    <td>{row.category_name}</td>
                                    <td className="text-right">{formatCurrency(parseFloat(row.precio_actual))}</td>
                                    <td className="text-right">{row.total_unidades}</td>
                                    <td className="text-right">{formatCurrency(parseFloat(row.total_revenue))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination-container">
                        <div className="pagination-info">
                            Mostrando {((response.page - 1) * response.limit) + 1} - {Math.min(response.page * response.limit, response.total)} de {response.total} productos
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
