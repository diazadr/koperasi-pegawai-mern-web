import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Alert from "../ui/alert/Alert";
import ChartTab from "../common/ChartTab";

type Props = {
  data?: any;
};

export default function StatisticsChart({ data }: Props) {
  if (!data) {
    return (
      <div className="text-center py-10 text-gray-500">
        Memuat data statistik...
      </div>
    );
  }

  const trendPenjualan = data.trend?.penjualan || [];
  const trendPembelian = data.trend?.pembelian || [];

  const bulan = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];

  // Mapping nama bulan database ke index grafik
const bulanMap: Record<string, number> = {
  "Januari": 0, "Februari": 1, "Maret": 2, "April": 3, "Mei": 4, "Juni": 5,
  "Juli": 6, "Agustus": 7, "September": 8, "Oktober": 9, "November": 10, "Desember": 11,
};

// Fungsi normalisasi array
const normalizeTrend = (rawData: any[]) => {
  const arr = Array(12).fill(0);
  rawData.forEach((item) => {
    const bulanNama = item._id.split("-")[1]; // contoh "2025-April" → "April"
    const idx = bulanMap[bulanNama];
    if (idx !== undefined) arr[idx] = item.total;
  });
  return arr;
};

// Gunakan hasil normalisasi ke grafik
const penjualanData = normalizeTrend(trendPenjualan);
const pembelianData = normalizeTrend(trendPembelian);


 

  const adaData =
    penjualanData.some((v: number) => v > 0) ||
    pembelianData.some((v: number) => v > 0);

  const series = [
    { name: "Penjualan", data: penjualanData },
    { name: "Pembelian", data: pembelianData },
  ];

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF", "#22C55E"], // Penjualan, Pembelian
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
    },
    stroke: { curve: "straight", width: [2, 2] },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      x: { show: true },
      y: {
        formatter: (val: number) => `Rp ${val.toLocaleString("id-ID")}`,
      },
    },
    xaxis: {
      type: "category",
      categories: bulan,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistik
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Menampilkan trend penjualan dan pembelian 12 bulan terakhir
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      {!adaData ? (
        <Alert
          variant="warning"
          title="Informasi"
          message="Data trend penjualan dan pembelian belum tersedia."
          showLink={false}
        />
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px] xl:min-w-full">
            <Chart options={options} series={series} type="area" height={310} />
          </div>
        </div>
      )}
    </div>
  );
}
