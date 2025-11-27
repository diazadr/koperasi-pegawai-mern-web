import { useState } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Alert from "../../components/ui/alert/Alert";
import PrediksiBarangTerlarisBulan from "../../components/ecommerce/Prediction";
import PrediksiBarangTerlarisTahunan from "../../components/ecommerce/PredictionYear";
import { apiGet } from "../../lib/api";

const monthOptions = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
].map((m, i) => ({
  value: (i + 1).toString().padStart(2, "0"),
  label: m,
}));


export default function Home() {
  const [bulan, setBulan] = useState<number | string>(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState<number | string>(new Date().getFullYear());
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async (tahun: string | number, bulan: string | number) => {
    setLoading(true);
    try {
      const periode = `${tahun}-${monthOptions[+bulan - 1].label}`;
      const res = await apiGet(`/api/dashboard?periode=${periode}`);
      if (!res.ok) throw new Error(`Gagal fetch: ${res.status}`);
      const json = await res.json();
      setDashboardData(json);
      setAlertMsg(`Analisis untuk periode ${monthOptions[+bulan - 1].label} ${tahun} berhasil dimuat`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch (error) {
      console.error("Gagal memuat dashboard:", error);
      setAlertMsg("Gagal memuat data analisis. Pastikan periode tersedia.");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => fetchDashboard(tahun, bulan);

  const handleExportExcel = () => {
    const periode = `${tahun}-${monthOptions[+bulan - 1].label}`;
    window.open(`/api/dashboard/export-excel?periode=${periode}`, "_blank");
  };

  return (
    <>
      <PageMeta
        title="Dashboard Koperasi Digital"
        description="Analisis dan ringkasan operasional koperasi"
      />

      <ComponentCard title="Filter Periode Analisis">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <Label>Bulan</Label>
            <Select
              options={monthOptions}
              placeholder="Pilih Bulan"
              value={bulan}
              onChange={setBulan}
              className="w-44"
            />
          </div>
          <div>
            <Label>Tahun</Label>
            <Input
              type="number"
              placeholder="2025"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-28"
            />
          </div>

          <button
            onClick={handleFilter}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition disabled:opacity-50"
          >
            {loading ? "Memuat..." : "Tampilkan Analisis"}
          </button>

          <button
            onClick={handleExportExcel}
            className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Ekspor Excel
          </button>
        </div>
      </ComponentCard>

      {showAlert && (
        <div className="mt-3">
          <Alert
            variant="success"
            title="Status"
            message={alertMsg}
            showLink={false}
          />
        </div>
      )}

      {dashboardData && (
        <div className="grid grid-cols-12 gap-4 md:gap-6 mt-6">

          <div className="col-span-12">
            <EcommerceMetrics data={dashboardData} />
          </div>

          <div className="col-span-12">
            <MonthlySalesChart data={dashboardData} />
          </div>

          <div className="col-span-12">
            <MonthlyTarget data={dashboardData} />
          </div>

          <div className="col-span-12">
            <StatisticsChart data={dashboardData} />
          </div>

          <div className="col-span-12">
            <RecentOrders data={dashboardData} />
          </div>

          {dashboardData?.prediksi?.bulanBerikutnya?.length > 0 && (
            <div className="col-span-12">
              <PrediksiBarangTerlarisBulan
                data={dashboardData}
                periode={`${monthOptions[+bulan - 1].label} ${tahun}`}
              />
            </div>
          )}

          {dashboardData?.prediksi && (
            <div className="col-span-12">
              <PrediksiBarangTerlarisTahunan
                data={dashboardData.prediksi}
                periode={`${monthOptions[+bulan - 1].label} ${tahun}`}
              />
            </div>
          )}

        </div>
      )}

    </>
  );
}
