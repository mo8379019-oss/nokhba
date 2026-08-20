import { ReactNode } from "react";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyLabel?: string;
}

export function DataTable<T>({ columns, rows, rowKey, emptyLabel = "لا توجد بيانات" }: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-light bg-white py-16 text-center text-dark-light">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-light/60 bg-white shadow-soft">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-right text-sm">
          <thead className="bg-offwhite text-dark-light">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={`px-4 py-3 font-semibold ${col.className ?? ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-light/60">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="hover:bg-offwhite/70">
                {columns.map((col, i) => (
                  <td key={i} className={`px-4 py-3 ${col.className ?? ""}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-gray-light/60 md:hidden">
        {rows.map((row) => (
          <div key={rowKey(row)} className="space-y-1.5 p-4">
            {columns.map((col, i) => (
              <div key={i} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-xs font-medium text-dark-light">{col.header}</span>
                <span className="text-dark">{col.render(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
