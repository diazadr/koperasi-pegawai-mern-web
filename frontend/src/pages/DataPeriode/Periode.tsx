import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import Alert from "../../components/ui/alert/Alert";
import Badge from "../../components/ui/badge/Badge";
import { apiGet, apiDelete } from "../../lib/api";  // ← TAMBAHKAN INI

export default function PeriodeList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  // 🔄 Ambil daftar periode
  const fetchPeriode = async () => {
    setLoading(true);
    setError("");
    try {
      const json = await apiGet("/api/upload-bulanan/periode/list");
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriode();
  }, []);

  // 🗑️ Hapus data satu periode
  const handleDeletePeriode = async (periode: string) => {
    if (!confirm(`Yakin ingin menghapus semua data periode ${periode}?`)) return;
    try {
      const params = new URLSearchParams({ periode });
      await Promise.all([
        apiDelete(`/api/pembelian?${params.toString()}`),
        apiDelete(`/api/penjualan?${params.toString()}`),
        apiDelete(`/api/retur?${params.toString()}`),
        apiDelete(`/api/stok_opname?${params.toString()}`),
      ]);
      setAlertMsg(`Data periode ${periode} berhasil dihapus.`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
      fetchPeriode();
    } catch {
      setError(`Gagal menghapus data periode ${periode}`);
    }
  };

  const StatusBadge = ({ exists }: { exists: boolean }) =>
    exists ? (
      <Badge variant="solid" color="success">Ada</Badge>
    ) : (
      <Badge variant="solid" color="error">Tidak Ada</Badge>
    );

  return (
    <>
      <PageMeta
        title="Daftar Periode Upload Bulanan"
        description="Lihat daftar periode dan status tabelnya."
      />

      {showAlert && (
        <div className="mb-4">
          <Alert variant="success" title="Berhasil" message={alertMsg} showLink={false} />
        </div>
      )}

      <ComponentCard title="Daftar Periode Upload Bulanan">
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400 py-10 text-center">
            Memuat data...
          </div>
        ) : error ? (
          <div className="text-red-500 py-6 text-center">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 py-10 text-center">
            Belum ada data periode.
          </div>
        ) : (
          <BasicTableOne
            title="Daftar Periode"
            data={data}
            columns={[
              { key: "periode", label: "Periode" },
              {
                key: "pembelian",
                label: "Pembelian",
                render: (row: any) => <StatusBadge exists={row.pembelian} />,
              },
              {
                key: "penjualan",
                label: "Penjualan",
                render: (row: any) => <StatusBadge exists={row.penjualan} />,
              },
              {
                key: "retur",
                label: "Retur",
                render: (row: any) => <StatusBadge exists={row.retur} />,
              },
              {
                key: "stokopname",
                label: "Stok Opname",
                render: (row: any) => <StatusBadge exists={row.stokopname} />,
              },
              {
                key: "actions",
                label: "Aksi",
                render: (row: any) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeletePeriode(row.periode)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </ComponentCard>
    </>
  );
}
