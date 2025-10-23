import { useState, useEffect } from "react";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Alert from "../../components/ui/alert/Alert";


interface StokOpnameItem {
  kode_item: string;
  nama_item: string;
  qty_fisik: number;
  qty_sistem: number;
  selisih: number;
  satuan: string;
  periode: string;
}


const monthOptions = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
].map((m, i) => ({
  value: (i + 1).toString().padStart(2, "0"), // agar formatnya "01", "02", dst
  label: m,
}));

const sortOptions = [
  { value: "nama_asc", label: "Nama A → Z" },
  { value: "nama_desc", label: "Nama Z → A" },
  { value: "selisih_desc", label: "Selisih Terbesar" },
  { value: "selisih_asc", label: "Selisih Terkecil" },
];

export default function StokOpname() {
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [data, setData] = useState<StokOpnameItem[]>([]);
  const [filteredData, setFilteredData] = useState<StokOpnameItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔄 Ambil data stok_opname
const handleFetch = async () => {
  if (!bulan || !tahun) {
    setError("Pilih bulan dan isi tahun terlebih dahulu!");
    setData([]);
    return;
  }

  // Temukan nama bulan dari label
  const bulanLabel = monthOptions.find((m) => m.value === bulan)?.label;
  const periode = `${tahun}-${bulanLabel}`;

  setError("");
  setLoading(true);
  try {
    const params = new URLSearchParams({ periode });
    const res = await fetch(`/api/stok_opname?${params.toString()}`);
    const json = await res.json();
    setData(json);
    setFilteredData(json);
  } catch {
    setError("Gagal mengambil data stok opname");
  } finally {
    setLoading(false);
  }
};


  // 🔽 Sorting
  useEffect(() => {
    let sorted = [...data];
    switch (sortBy) {
      case "nama_asc":
        sorted.sort((a, b) => a.nama_item.localeCompare(b.nama_item));
        break;
      case "nama_desc":
        sorted.sort((a, b) => b.nama_item.localeCompare(a.nama_item));
        break;
      case "selisih_desc":
        sorted.sort((a, b) => b.selisih - a.selisih);
        break;
      case "selisih_asc":
        sorted.sort((a, b) => a.selisih - b.selisih);
        break;
      default:
        break;
    }
    setFilteredData(sorted);
    setCurrentPage(1);
  }, [sortBy, data]);

  // 🔍 Search
  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredData(
      data.filter((i) =>
        [i.nama_item, i.kode_item]
          .some((f) => f?.toLowerCase().includes(q))
      )
    );
    setCurrentPage(1);
  }, [search, data]);

  // 🗑️ Hapus periode
  const handleDeletePeriode = async () => {
    if (!bulan || !tahun) {
      alert("Isi bulan dan tahun terlebih dahulu!");
      return;
    }
    if (!confirm(`Yakin ingin menghapus semua data stok opname periode ${bulan}-${tahun}?`)) return;
    try {
      const params = new URLSearchParams({ periode: `${tahun}-${bulan}` });
      await fetch(`/api/stok_opname?${params.toString()}`, { method: "DELETE" });
      setData([]);
      setFilteredData([]);
      setAlertMsg(`Data stok opname periode ${bulan}-${tahun} berhasil dihapus.`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch {
      alert("Gagal menghapus data periode ini");
    }
  };

  return (
    <>
      <PageMeta title="Stok Opname" description="Laporan stok opname per periode" />

      {showAlert && (
        <div className="mb-4">
          <Alert variant="success" title="Berhasil" message={alertMsg} showLink={false} />
        </div>
      )}

      <ComponentCard title="Filter Periode Stok Opname">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <Label>Bulan</Label>
            <Select
              options={monthOptions}
              placeholder="Pilih Bulan"
              onChange={(val) => setBulan(val)}
              className="w-40"
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
          <div>
            <Label>Urutkan</Label>
            <Select
              options={sortOptions}
              placeholder="Pilih Urutan"
              onChange={(val) => setSortBy(val)}
              className="w-48"
            />
          </div>
          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition disabled:opacity-50"
          >
            {loading ? "Memuat..." : "Tampilkan Data"}
          </button>
          <button
            onClick={handleDeletePeriode}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Hapus Periode
          </button>
        </div>
      </ComponentCard>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {data.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-center py-10">
          {loading ? "Memuat data..." : "Belum ada data untuk periode ini."}
        </div>
      ) : (
        <div className="mt-6">
          <BasicTableOne
            title="Tabel Stok Opname"
            data={paginatedData}
            search={search}
            onSearchChange={setSearch}
            columns={[
              { key: "kode_item", label: "Kode Item" },
              { key: "nama_item", label: "Nama Item" },
              { key: "qty_fisik", label: "Qty Fisik" },
              { key: "qty_sistem", label: "Qty Sistem" },
              { key: "selisih", label: "Selisih" },
              { key: "satuan", label: "Satuan" },
              { key: "periode", label: "Periode" },
            ]}
          />

          {filteredData.length > 0 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white disabled:opacity-50"
              >
                ← Prev
              </button>
              <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
