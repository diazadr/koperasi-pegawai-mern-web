// src/components/tables/BasicTables/BasicTableOne.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface TableColumn {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface BasicTableOneProps {
  title?: string;
  columns: TableColumn[];
  data: any[];
  search?: string;
  onSearchChange?: (val: string) => void;
}

export default function BasicTableOne({
  title,
  columns,
  data,
  search,
  onSearchChange,
}: BasicTableOneProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header Section */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-white/[0.05]">
        {title && (
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h2>
        )}
        {onSearchChange && (
          <input
            type="text"
            placeholder="Cari..."
            value={search || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-brand-500/30 dark:bg-gray-800 dark:text-white"
          />
        )}
      </div>

      {/* Table Section */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.length > 0 ? (
              data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className="px-5 py-4 text-start text-gray-700 dark:text-gray-300"
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-5 text-gray-500 dark:text-gray-400"
                >
                  Tidak ada data ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
