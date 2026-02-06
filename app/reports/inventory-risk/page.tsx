"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

interface InventoryRisk {
    product_id: number;
    product_name: string;
    category_id: number;
    category_name: string;
    stock_actual: string;
    min_stock: string;
    stock_percentage: string;
    risk_level: string;
    unidades_recomendadas_pedir: string;
    costo_reposicion: string;
}

const CATEGORIES = [
    { id: 0, name: "Todas las categorías" },
    { id: 1, name: "Bebidas calientes" },
    { id: 2, name: "Bebidas frías" },
    { id: 3, name: "Panadería" },
    { id: 4, name: "Snacks" },
    { id: 5, name: "Postres" },
];

export default function InventoryRiskPage() {
    const [data, setData] = useState<InventoryRisk[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryId, setCategoryId] = useState(0);

    const fetchData = async (catId: number) => {
        setLoading(true);
        const params = new URLSearchParams();
        if (catId > 0) params.set("category_id", catId.toString());

        const res = await fetch(`/api/reports/inventory-risk?${params}`);
        const json = await res.json();
        setData(json);
        setLoading(false);
    };

    useEffect(() => {
        fetchData(categoryId);
    }, [categoryId]);

    const productosCriticos = data.filter(row => row.risk_level === "CRITICO").length;
    const productosBajos = data.filter(row => row.risk_level === "BAJO").length;
    const costoTotalReposicion = data.reduce((sum, row) => sum + parseFloat(row.costo_reposicion), 0);
    const unidadesTotalesPedir = data.reduce((sum, row) => sum + parseInt(row.unidades_recomendadas_pedir), 0);

    return (
        <>
            <h1 className="page-title">Inventario en riesgo</h1>
            <p className="page-description">
                Productos con niveles de stock por debajo del mínimo requerido. Los productos críticos tienen
                menos del 50% del stock mínimo, mientras que los productos bajos están entre 50% y 100%.
            </p>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-label">Productos críticos</div>
                    <div className="kpi-value">{productosCriticos}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Productos bajos</div>
                    <div className="kpi-value">{productosBajos}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Unidades a pedir</div>
                    <div className="kpi-value">{unidadesTotalesPedir}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Costo reposición</div>
                    <div className="kpi-value">{formatCurrency(costoTotalReposicion)}</div>
                </div>
            </div>

            <div className="filters-row">
                <div className="filter-group">
                    <label>Categoría</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(parseInt(e.target.value))}
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <p className="loading">Cargando datos...</p>
            ) : data.length === 0 ? (
                <p className="loading">No hay productos en riesgo en esta categoría</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th className="text-right">Stock actual</th>
                            <th className="text-right">Stock mínimo</th>
                            <th className="text-right">% Stock</th>
                            <th>Riesgo</th>
                            <th className="text-right">Pedir</th>
                            <th className="text-right">Costo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.product_id}>
                                <td>{row.product_name}</td>
                                <td>{row.category_name}</td>
                                <td className="text-right">{row.stock_actual}</td>
                                <td className="text-right">{row.min_stock}</td>
                                <td className="text-right">{formatPercentage(parseFloat(row.stock_percentage))}</td>
                                <td>{row.risk_level.charAt(0) + row.risk_level.slice(1).toLowerCase()}</td>
                                <td className="text-right">{row.unidades_recomendadas_pedir}</td>
                                <td className="text-right">{formatCurrency(parseFloat(row.costo_reposicion))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}
