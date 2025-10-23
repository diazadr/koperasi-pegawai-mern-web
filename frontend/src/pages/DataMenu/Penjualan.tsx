import { useState, useEffect } from "react";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Alert from "../../components/ui/alert/Alert";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import OriginalInput from "../../components/form/input/InputField";
import OriginalButton from "../../components/ui/button/Button";
import type { InputHTMLAttributes, ButtonHTMLAttributes } from "react";
const Input = OriginalInput as React.FC<InputHTMLAttributes<HTMLInputElement>>;
const Button = OriginalButton as React.FC<
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }
>;


const monthOptions = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
].map((m) => ({ value: m, label: m }));

const sortOptions = [
  { value: "nama_asc", label: "Nama A → Z" },
  { value: "nama_desc", label: "Nama Z → A" },
  { value: "stok_desc", label: "Jumlah Terbanyak" },
  { value: "stok_asc", label: "Jumlah Tersedikit" },
  { value: "harga_desc", label: "Harga Tertinggi" },
  { value: "harga_asc", label: "Harga Terendah" },
];

export default function Penjualan() {
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
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

  // --- Modal logic
  const { isOpen, openModal, closeModal } = useModal();
  const [form, setForm] = useState({
    kode_item: "",
    nama_item: "",
    merek: "",
    jenis: "",
    jumlah: "",
    satuan: "",
    total_harga: "",
  });
  const [saving, setSaving] = useState(false);

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
      const res = await fetch(`/api/penjualan?${params.toString()}`);
      const json = await res.json();
      setData(json);
      setFilteredData(json);
    } catch {
      setError("Gagal mengambil data penjualan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let sorted = [...data];
    switch (sortBy) {
      case "nama_asc": sorted.sort((a, b) => a.nama_item.localeCompare(b.nama_item)); break;
      case "nama_desc": sorted.sort((a, b) => b.nama_item.localeCompare(a.nama_item)); break;
      case "stok_desc": sorted.sort((a, b) => b.jumlah - a.jumlah); break;
      case "stok_asc": sorted.sort((a, b) => a.jumlah - b.jumlah); break;
      case "harga_desc": sorted.sort((a, b) => b.total_harga - a.total_harga); break;
      case "harga_asc": sorted.sort((a, b) => a.total_harga - b.total_harga); break;
    }
    setFilteredData(sorted);
    setCurrentPage(1);
  }, [sortBy, data]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredData(
      data.filter((i) =>
        [i.nama_item, i.kode_item, i.merek, i.jenis, i.satuan]
          .some((f) => f?.toLowerCase().includes(q)) ||
        i.jumlah?.toString().includes(q) ||
        i.total_harga?.toString().includes(q)
      )
    );
    setCurrentPage(1);
  }, [search, data]);

  const handleDeletePeriode = async () => {
    if (!bulan || !tahun) {
      alert("Isi bulan dan tahun terlebih dahulu!");
      return;
    }
    if (!confirm(`Yakin ingin menghapus semua data penjualan periode ${bulan} ${tahun}?`)) return;
    try {
      const params = new URLSearchParams({ periode: `${tahun}-${bulan}` });
      await fetch(`/api/penjualan?${params.toString()}`, { method: "DELETE" });
      setData([]);
      setFilteredData([]);
      setAlertMsg(`Data penjualan periode ${bulan} ${tahun} berhasil dihapus.`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch {
      alert("Gagal menghapus data periode ini");
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!bulan || !tahun) {
      alert("Isi bulan dan tahun terlebih dahulu!");
      return;
    }

    const periode = `${tahun}-${bulan}`;
    setSaving(true);
    try {
      const res = await fetch("/api/penjualan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, periode }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");
      closeModal();
      setForm({
        kode_item: "",
        nama_item: "",
        merek: "",
        jenis: "",
        jumlah: "",
        satuan: "",
        total_harga: "",
      });
      handleFetch();
      setAlertMsg("Data penjualan berhasil ditambahkan.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch {
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageMeta title="Data Penjualan" description="Laporan penjualan per periode (Big Data Mode)" />

      {showAlert && (
        <div className="mb-4">
          <Alert variant="success" title="Berhasil" message={alertMsg} showLink={false} />
        </div>
      )}

      <ComponentCard title="Filter Periode Penjualan">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <Label>Bulan</Label>
            <Select options={monthOptions} placeholder="Pilih Bulan" onChange={setBulan} className="w-40" />
          </div>
          <div>
            <Label>Tahun</Label>
            <Input type="number" placeholder="2025" value={tahun} onChange={(e)=>setTahun(e.target.value)} className="w-28"/>
          </div>
          <div>
            <Label>Urutkan</Label>
            <Select options={sortOptions} placeholder="Pilih Urutan" onChange={setSortBy} className="w-48"/>
          </div>
          <button onClick={handleFetch} disabled={loading} className="px-5 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition disabled:opacity-50">
            {loading ? "Memuat..." : "Tampilkan Data"}
          </button>
          <button onClick={handleDeletePeriode} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
            Hapus Periode
          </button>

          <Button onClick={openModal} className="bg-green-600 hover:bg-green-700 text-white">
            + Tambah Data Manual
          </Button>
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
            title="Tabel Penjualan"
            data={paginatedData}
            search={search}
            onSearchChange={setSearch}
            columns={[
              { key: "kode_item", label: "Kode Item" },
              { key: "nama_item", label: "Nama Item" },
              { key: "merek", label: "Merek" },
              { key: "jenis", label: "Jenis" },
              { key: "jumlah", label: "Jumlah" },
              { key: "satuan", label: "Satuan" },
              { key: "total_harga", label: "Total Harga" },
            ]}
          />

          {filteredData.length > 0 && (
            <div className="flex justify-center mt-4 gap-2">
              <button onClick={() => setCurrentPage((p)=>Math.max(p-1,1))} disabled={currentPage===1}
                className="px-3 py-1 border rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white disabled:opacity-50">
                ← Prev
              </button>
              <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button onClick={() => setCurrentPage((p)=>Math.min(p+1,totalPages))} disabled={currentPage===totalPages}
                className="px-3 py-1 border rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white disabled:opacity-50">
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px]">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Tambah Data Penjualan
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kode Item</Label>
                <Input name="kode_item" value={form.kode_item} onChange={handleChange} required />
              </div>
              <div>
                <Label>Nama Item</Label>
                <Input name="nama_item" value={form.nama_item} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Merek</Label>
                <Input name="merek" value={form.merek} onChange={handleChange} />
              </div>
              <div>
                <Label>Jenis</Label>
                <Input name="jenis" value={form.jenis} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Jumlah</Label>
                <Input type="number" name="jumlah" value={form.jumlah} onChange={handleChange} required />
              </div>
              <div>
                <Label>Satuan</Label>
                <Input name="satuan" value={form.satuan} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <Label>Total Harga</Label>
              <Input type="number" name="total_harga" value={form.total_harga} onChange={handleChange} required />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <Button type="button" variant="outline" onClick={closeModal}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
