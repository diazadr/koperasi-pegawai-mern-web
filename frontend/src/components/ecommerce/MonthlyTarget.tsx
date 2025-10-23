import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

type Props = {
  data?: any;
};

export default function MonthlyTarget({ data }: Props) {
  if (!data) {
    return (
      <div className="text-center py-10 text-gray-500">
        Memuat analisis bulanan...
      </div>
    );
  }

  // Data dari backend
  const {totalPenjualan, labaRugi, periode } = data;

  // Tentukan target otomatis (misal 10% lebih tinggi dari penjualan saat ini)
  const target = totalPenjualan * 1.1; // 10% growth target
  const persentaseTarget = ((totalPenjualan / target) * 100).toFixed(2);

  // Setup chart radial
  const series = [parseFloat(persentaseTarget)];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: { background: "#E4E7EC", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: (val) => val + "%",
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Analisis Bulanan ({periode})
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Ringkasan pembelian, penjualan, dan laba/rugi bulan ini
            </p>
          </div>
          <div className="relative inline-block">
            <button onClick={() => setIsOpen(!isOpen)}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 p-2">
              <DropdownItem onItemClick={() => setIsOpen(false)} className="hover:bg-gray-100">
                Lihat Detail
              </DropdownItem>
              <DropdownItem onItemClick={() => setIsOpen(false)} className="hover:bg-gray-100">
                Hapus
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="relative">
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart options={options} series={series} type="radialBar" height={330} />
          </div>
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          Laba bulan ini sebesar <b>Rp {labaRugi.toLocaleString("id-ID")}</b>
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Target
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Rp {Math.round(target).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Penjualan
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Rp {Math.round(totalPenjualan).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
}