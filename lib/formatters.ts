export function formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`;
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("es-MX");
}

export function formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
}
