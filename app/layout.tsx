import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Cafe",
  description: "Dashboard de reportes",
};

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/reports/sales-daily", label: "Ventas diarias" },
  { href: "/reports/top-products", label: "Top productos" },
  { href: "/reports/inventory-risk", label: "Inventario en riesgo" },
  { href: "/reports/customer-value", label: "Valor del cliente" },
  { href: "/reports/payment-mix", label: "Mezcla de pagos" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="app-layout">
          <aside className="sidebar">
            <div className="sidebar-title">Campus Cafe</div>
            <nav className="sidebar-nav">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="sidebar-link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
