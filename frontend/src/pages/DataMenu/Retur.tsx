import { useState, useEffect } from "react";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Alert from "../../components/ui/alert/Alert";
import { apiGet, apiDelete } from "../../lib/api";

const monthOptions = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
].map((m) => ({ value: m, label: m }));

const sortOptions = [
  { value: "nama_asc", label: "Nama A → Z" },
  { value: "nama_desc", label: "Nama Z → A" },
  { value: "jumlah_desc", label: "Jumlah Terbanyak" },
  { value: "jumlah_asc", label: "Jumlah Tersedikit" },
  { value: "harga_desc", label: "Harga Tertinggi" },
  { value: "harga_asc", label: "Harga Terendah" },
];

interface ReturItem {
  kode_item: string;
  nama_item: string;
  jumlah: number;
  satuan: string;
  harga_satuan: number;
  potongan: number;
  total_harga: number;
}

export default function Retur() {
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [data, setData] = useState<ReturItem[]>([]);
  const [filteredData, setFilteredData] = useState<ReturItem[]>([]);
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

  const handleFetch = async () => {
    if (!bulan || !tahun) {
      setError("Pilih bulan dan isi tahun terlebih dahulu!");
      setData([]);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const params = new URLSearchParams({ periode: `${tahun}-${bulan}` });
      const res = await apiGet(`/api/retur?${params.toString()}`);
      const json = await res.json();
      setData(json);
      setFilteredData(json);
    } catch {
      setError("Gagal mengambil data retur");
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
      case "jumlah_desc":
        sorted.sort((a, b) => b.jumlah - a.jumlah);
        break;
      case "jumlah_asc":
        sorted.sort((a, b) => a.jumlah - b.jumlah);
        break;
      case "harga_desc":
        sorted.sort((a, b) => b.total_harga - a.total_harga);
        break;
      case "harga_asc":
        sorted.sort((a, b) => a.total_harga - b.total_harga);
        break;
    }
    setFilteredData(sorted);
    setCurrentPage(1);
  }, [sortBy, data]);

  // 🔍 Pencarian
  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredData(
      data.filter((i) =>
        [i.nama_item, i.kode_item, i.satuan]
          .some((f) => f?.toLowerCase().includes(q)) ||
        i.jumlah?.toString().includes(q) ||
        i.total_harga?.toString().includes(q)
      )
    );
    setCurrentPage(1);
  }, [search, data]);

  // 🗑️ Delete per Periode
  const handleDeletePeriode = async () => {
    if (!bulan || !tahun) {
      alert("Isi bulan dan tahun terlebih dahulu!");
      return;
    }
    if (!confirm(`Yakin ingin menghapus semua data retur periode ${bulan} ${tahun}?`)) return;
    try {
      const params = new URLSearchParams({ periode: `${tahun}-${bulan}` });
      await apiDelete(`/api/retur?${params.toString()}`);
      setData([]);
      setFilteredData([]);
      setAlertMsg(`Data retur periode ${bulan} ${tahun} berhasil dihapus.`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch {
      alert("Gagal menghapus data periode ini");
    }
  };

  return (
    <>
      <PageMeta
        title="Data Retur"
        description="Laporan retur per periode (Big Data Mode)"
      />

      {showAlert && (
        <div className="mb-4">
          <Alert
            variant="success"
            title="Berhasil"
            message={alertMsg}
            showLink={false}
          />
        </div>
      )}

      <ComponentCard title="Filter Periode Retur">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <Label>Bulan</Label>
            <Select
              options={monthOptions}
              placeholder="Pilih Bulan"
              onChange={setBulan}
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
              onChange={setSortBy}
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
            title="Tabel Retur"
            data={paginatedData}
            search={search}
            onSearchChange={setSearch}
            columns={[
              { key: "kode_item", label: "Kode Item" },
              { key: "nama_item", label: "Nama Item" },
              { key: "jumlah", label: "Jumlah" },
              { key: "satuan", label: "Satuan" },
              { key: "harga_satuan", label: "Harga Satuan" },
              { key: "potongan", label: "Potongan" },
              { key: "total_harga", label: "Total Harga" },
            ]}
          />

          {/* 📄 Pagination */}
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
