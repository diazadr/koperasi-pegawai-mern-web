import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Alert from "../ui/alert/Alert";

interface PrediksiBarang {
   _id?: string;
  nama_item: string;
  prediksi_jumlah?: number;
}

interface Props {
  data?: any;
  periode?: string;
}

export default function PrediksiBarangTerlarisBulan({ data, periode }: Props) {
  if (!data) {
    return (
      <div className="text-center py-10 text-gray-500">
        Memuat prediksi barang terlaris...
      </div>
    );
  }

  const list: PrediksiBarang[] = data?.prediksi?.bulanBerikutnya || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Prediksi Barang Terlaris Bulan Berikutnya
          </h3>
          <p className="text-gray-500 text-theme-sm dark:text-gray-400">
            Berdasarkan tren penjualan {periode || "periode berjalan"}
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <Alert
          variant="warning"
          title="Informasi"
          message={`Belum ada data prediksi untuk ${periode || "periode ini"}.`}
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
                  Prediksi Jumlah Terjual
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {list.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                    {item.nama_item || item._id}
                  </TableCell>
                  <TableCell className="py-3 text-brand-600 font-semibold text-theme-sm">
                    {Number(item.prediksi_jumlah ?? 0).toLocaleString("id-ID")}
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
