import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Alert from "../ui/alert/Alert";

interface Barang {
  _id: string;
  total_jual: number;
  total_nilai: number;
}

interface Props {
  data?: any;
  periode?: string;
}

export default function RecentOrders({ data, periode }: Props) {
  if (!data) {
    return (
      <div className="text-center py-10 text-gray-500">
        Memuat data barang terlaris...
      </div>
    );
  }

  const list: Barang[] = data.barangTerlaris || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Barang Terlaris
          </h3>
          <p className="text-gray-500 text-theme-sm dark:text-gray-400">
            Berdasarkan total penjualan {periode || "periode berjalan"}
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <Alert
          variant="warning"
          title="Informasi"
          message={`Belum ada data barang terlaris untuk ${
            periode || "periode ini"
          }.`}
          showLink={false}
        />
      ) : (
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Produk
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Jumlah Terjual
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total Nilai
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {list.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                    {item._id}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.total_jual.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    Rp {item.total_nilai.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
