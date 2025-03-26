import { Link } from "react-router-dom";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-4">i'vE PLaYeD ThIs gAmE BEfoRe NiiBBAssS</h1>
        <ul>
          <li>
            <Link to="/" className="block py-2">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/factories" className="block py-2">
              Factories
            </Link>
          </li>
          <li>
            <Link to="/inventory" className="block py-2">
              Inventory
            </Link>
          </li>
          <li>
            <Link to="/market" className="block py-2">
              Market
            </Link>
          </li>
        </ul>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6 bg-violet-100">{children}</div>
    </div>
  );
}
