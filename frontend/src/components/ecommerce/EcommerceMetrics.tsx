import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

type Props = {
  data?: any;
};

export default function EcommerceMetrics({ data }: Props) {
  if (!data) {
    return (
      <div className="text-center py-10 text-gray-500">
        Memuat data analisis...
      </div>
    );
  }

  const {
    totalPembelian,
    totalPenjualan,
    totalRetur,
    labaRugi,
    totalStokOpname,
  } = data;

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {/* === Pembelian === */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/30">
          <GroupIcon className="text-blue-600 size-6 dark:text-blue-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Pembelian
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatRupiah(totalPembelian)}
            </h4>
          </div>
        </div>
      </div>

      {/* === Penjualan === */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/30">
          <BoxIconLine className="text-green-600 size-6 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Penjualan
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatRupiah(totalPenjualan)}
            </h4>
          </div>
        </div>
      </div>

      {/* === Retur === */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl dark:bg-yellow-900/30">
          <ArrowDownIcon className="text-yellow-600 size-6 dark:text-yellow-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Retur
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatRupiah(totalRetur?.total || 0)}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {totalRetur?.persentase ?? 0}% dari penjualan
            </p>
          </div>
        </div>
      </div>
      {/* === Total Stok (Stok Opname) === */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl dark:bg-teal-900/30">
          <BoxIconLine className="text-teal-600 size-6 dark:text-teal-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Stok (Opname)
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalStokOpname.toLocaleString("id-ID")} Unit
            </h4>
          </div>
        </div>
      </div>


      {/* === Laba / Rugi === */}
   {/* === Laba / Rugi === */}
<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/30">
    {labaRugi >= 0 ? (
      <ArrowUpIcon className="text-purple-600 size-6 dark:text-purple-400" />
    ) : (
      <ArrowDownIcon className="text-purple-600 size-6 dark:text-purple-400" />
    )}
  </div>
  <div className="flex items-end justify-between mt-5">
    <div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Laba / Rugi
      </span>
      <h4
        className={`mt-2 font-bold text-title-sm ${labaRugi >= 0
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
          }`}
      >
        {formatRupiah(labaRugi)}
      </h4>
      <p className="text-xs text-gray-500 mt-1">
        {labaRugi >= 0 ? "Laba tercapai" : "Terjadi rugi"}
      </p>
    </div>
  </div>
</div>

    </div>
  );
}
