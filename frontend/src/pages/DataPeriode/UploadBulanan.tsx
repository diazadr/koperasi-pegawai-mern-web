import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Alert from "../../components/ui/alert/Alert";
import FileInput from "../../components/form/input/FileInput";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";


const monthOptions = [
  { value: "Januari", label: "Januari" },
  { value: "Februari", label: "Februari" },
  { value: "Maret", label: "Maret" },
  { value: "April", label: "April" },
  { value: "Mei", label: "Mei" },
  { value: "Juni", label: "Juni" },
  { value: "Juli", label: "Juli" },
  { value: "Agustus", label: "Agustus" },
  { value: "September", label: "September" },
  { value: "Oktober", label: "Oktober" },
  { value: "November", label: "November" },
  { value: "Desember", label: "Desember" },
];

const UploadBulanan: React.FC = () => {
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [pembelian, setPembelian] = useState<File | null>(null);
  const [penjualan, setPenjualan] = useState<File | null>(null);
  const [retur, setRetur] = useState<File | null>(null);
  const [stokOpname, setStokOpname] = useState<FileList | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bulan || !tahun) {
      setAlert({
        type: "error",
        message: "Pilih bulan dan isi tahun terlebih dahulu!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("bulan", bulan);
    formData.append("tahun", tahun);
    if (pembelian) formData.append("pembelian", pembelian);
    if (penjualan) formData.append("penjualan", penjualan);
    if (retur) formData.append("retur", retur);
    if (stokOpname) {
      Array.from(stokOpname).forEach((file) =>
        formData.append("stok_opname", file)
      );
    }

    try {
      setLoading(true);
const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload-bulanan`, {
  method: "POST",
  body: formData,
});
      const data = await res.json();

      if (res.ok) {
        setAlert({
          type: "success",
          message: data.message || "Upload berhasil!",
        });
        setPembelian(null);
        setPenjualan(null);
        setRetur(null);
        setStokOpname(null);
      } else {
        setAlert({
          type: "error",
          message: data.message || "Upload gagal!",
        });
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Upload Data Bulanan | Koperasi Digital"
        description="Unggah data pembelian, penjualan, retur, dan stok opname untuk periode tertentu"
      />
      <PageBreadcrumb pageTitle="Upload Data Bulanan" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PERIODE */}
        <ComponentCard title="Periode Upload">
          <div className="flex flex-wrap gap-4">
            <div>
              <Label>Bulan</Label>
              <Select
                options={monthOptions}
                placeholder="Pilih Bulan"
                onChange={(val: string) => setBulan(val)}
                className="dark:bg-dark-900"
              />
            </div>


            <div>
              <Label>Tahun</Label>
              <Input
                type="number"
                placeholder="2025"
                value={tahun}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTahun(e.target.value)
                }
                className="w-28"
              />
            </div>
          </div>
        </ComponentCard>

        {/* PEMBELIAN */}
        <ComponentCard title="Upload Pembelian (.csv)">
          <div>
            <Label>File Pembelian</Label>
            <FileInput
              accept=".csv"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPembelian(e.target.files?.[0] || null)
              }
            />
          </div>
        </ComponentCard>

        {/* PENJUALAN */}
        <ComponentCard title="Upload Penjualan (.csv)">
          <div>
            <Label>File Penjualan</Label>
            <FileInput
              accept=".csv"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPenjualan(e.target.files?.[0] || null)
              }
            />
          </div>
        </ComponentCard>

        {/* RETUR */}
        <ComponentCard title="Upload Retur (.csv)">
          <div>
            <Label>File Retur</Label>
            <FileInput
              accept=".csv"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRetur(e.target.files?.[0] || null)
              }
            />
          </div>
        </ComponentCard>

        {/* STOK OPNAME */}
        <ComponentCard title="Upload Stok Opname (2 file .xlsx)">
          <div>
            <Label>File Stok Opname</Label>
            <FileInput
              multiple
              accept=".xlsx"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStokOpname(e.target.files)
              }
            />
          </div>
        </ComponentCard>

        {/* BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition disabled:opacity-50"
          >
            {loading ? "Mengunggah..." : "Upload Sekarang"}
          </button>
        </div>

        {/* ALERT */}
        {alert.type && (
          <ComponentCard title="Status Upload">
            <Alert
              variant={alert.type === "success" ? "success" : "error"}
              title={alert.type === "success" ? "Berhasil" : "Gagal"}
              message={alert.message}
              showLink={false}
            />
          </ComponentCard>
        )}
      </form>
    </>
  );
};

export default UploadBulanan;
