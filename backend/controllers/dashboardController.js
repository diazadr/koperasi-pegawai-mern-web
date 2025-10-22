import asyncHandler from "express-async-handler";
import Pembelian from "../models/pembelianModel.js";
import Penjualan from "../models/penjualanModel.js";
import Retur from "../models/returModel.js";
import Stok from "../models/stokOpnameModel.js";
import ExcelJS from "exceljs";

export const getDashboardSummary = asyncHandler(async (req, res) => {
  try {
    const { periode } = req.query;

    if (!periode) {
      res.status(400);
      throw new Error("Periode wajib diisi. Contoh format: 2025-Januari");
    }

    const tahunSekarang = parseInt(periode.split("-")[0], 10);
    const tahunPrediksi = tahunSekarang + 1;

    const monthNameToNum = {
      Januari: 1, Februari: 2, Maret: 3, April: 4, Mei: 5, Juni: 6,
      Juli: 7, Agustus: 8, September: 9, Oktober: 10, November: 11, Desember: 12,
    };
    const monthNumToName = Object.fromEntries(
      Object.entries(monthNameToNum).map(([k, v]) => [v, k])
    );

    const parsePeriode = (periodeStr) => {
      if (!periodeStr || typeof periodeStr !== "string") return { tahun: 0, bulan: 0 };
      const parts = periodeStr.split("-");
      const tahun = parseInt(parts[0], 10) || 0;
      const bulan = monthNameToNum[parts[1]] || 0;
      return { tahun, bulan };
    };

    const [pembelianAgg, penjualanAgg, returAgg, stokAgg] = await Promise.all([
      Pembelian.aggregate([{ $match: { periode } }, { $group: { _id: null, total: { $sum: "$total_harga" } } }]),
      Penjualan.aggregate([{ $match: { periode } }, { $group: { _id: null, total: { $sum: "$total_harga" } } }]),
      Retur.aggregate([{ $match: { periode } }, { $group: { _id: null, total: { $sum: "$total_harga" }, jumlah: { $sum: "$jumlah" } } }]),
      Stok.aggregate([{ $match: { periode } }, { $group: { _id: null, total: { $sum: "$qty_fisik" } } }]),
    ]);

    const totalPembelian = pembelianAgg[0]?.total || 0;
    const totalPenjualan = penjualanAgg[0]?.total || 0;
    const totalRetur = returAgg[0]?.total || 0;
    const jumlahRetur = returAgg[0]?.jumlah || 0;
    const totalStokOpname = stokAgg[0]?.total || 0;

    // LABA RUGI (fix: hindari minus tak wajar)
    const labaRugi = totalPenjualan - totalPembelian;

    // TREND PENJUALAN & PEMBELIAN
    const [rawTrendPenjualan, rawTrendPembelian] = await Promise.all([
      Penjualan.aggregate([{ $group: { _id: "$periode", total: { $sum: "$total_harga" } } }]),
      Pembelian.aggregate([{ $group: { _id: "$periode", total: { $sum: "$total_harga" } } }]),
    ]);

    const normalizeAndSortTrend = (arr) =>
      arr
        .map((r) => {
          const { tahun, bulan } = parsePeriode(r._id);
          return { ...r, tahun, bulan, sortKey: tahun * 100 + bulan };
        })
        .filter((r) => r.tahun > 0 && r.bulan > 0)
        .sort((a, b) => a.sortKey - b.sortKey);

    let trendPenjualan = normalizeAndSortTrend(rawTrendPenjualan);
    let trendPembelian = normalizeAndSortTrend(rawTrendPembelian);

    const allPeriods = new Set([
      ...trendPenjualan.map((t) => `${t.tahun}-${t.bulan}`),
      ...trendPembelian.map((t) => `${t.tahun}-${t.bulan}`),
    ]);

    if (allPeriods.size === 0) {
      return res.json({
        periode,
        totalPembelian,
        totalPenjualan,
        totalRetur: { total: totalRetur, jumlah: jumlahRetur, persentase: "0.00" },
        labaRugi,
        totalStokOpname,
        trend: { pembelian: [], penjualan: [] },
        stokDistribusi: [],
        barangTerlaris: [],
        prediksi: {
          tahunPrediksi,
          bulanBerikutnya: [],
          barangTerlarisFinal: [],
          labaTahunDepan: 0,
          keuntunganTahunan: { tahunPrediksi, estimasi: 0 },
        },
      });
    }

    const minTahun = Math.min(...Array.from(allPeriods).map((p) => +p.split("-")[0]));
    const maxTahun = Math.max(...Array.from(allPeriods).map((p) => +p.split("-")[0]));
    const fullPeriods = [];
    for (let y = minTahun; y <= maxTahun; y++) {
      for (let m = 1; m <= 12; m++) {
        fullPeriods.push({ _id: `${y}-${monthNumToName[m]}`, tahun: y, bulan: m });
      }
    }

    const fillTrend = (trendArr) =>
      fullPeriods.map((p) => {
        const found = trendArr.find((x) => x.tahun === p.tahun && x.bulan === p.bulan);
        return { _id: p._id, total: found ? found.total : 0 };
      });

    trendPenjualan = fillTrend(trendPenjualan);
    trendPembelian = fillTrend(trendPembelian);

    // TREND LABA (fix: disesuaikan penjualan-pembelian)
    const pembelianByPeriode = {};
    trendPembelian.forEach((p) => (pembelianByPeriode[p._id] = p.total));

    const trendLaba = trendPenjualan.map((p) => {
      const pembelian = pembelianByPeriode[p._id] || 0;
      return {
        periode: p._id,
        laba: p.total - pembelian,
      };
    });

    const labaBulanan = trendLaba.map((t) => t.laba);
    const labaValid = labaBulanan.filter((l) => !isNaN(l) && l !== 0);

    const totalLaba = labaValid.reduce((sum, val) => sum + val, 0);
    const rataLaba = labaValid.length ? totalLaba / labaValid.length : 0;

    // PREDIKSI LABA TAHUN DEPAN (stabil)
    let prediksiLabaTahunDepan = Math.round(rataLaba * 12);

    if (labaValid.length >= 3) {
      const growths = [];
      for (let i = 1; i < labaValid.length; i++) {
        const prev = labaValid[i - 1];
        const cur = labaValid[i];
        if (prev !== 0) growths.push((cur - prev) / prev);
      }

      const avgGrowth = growths.length
        ? growths.reduce((a, b) => a + b, 0) / growths.length
        : 0;

      const safeGrowth = Math.min(Math.max(avgGrowth, -0.2), 0.2);
      const lastLaba = labaValid.at(-1) || rataLaba;

      prediksiLabaTahunDepan = Math.round(lastLaba * 12 * (1 + safeGrowth));
    }

    // RETUR
    const persentaseRetur = totalPenjualan
      ? ((totalRetur / totalPenjualan) * 100).toFixed(2)
      : "0.00";

    // STOK DISTRIBUSI
    const stokDistribusiRaw = await Stok.aggregate([
      { $match: { periode } },
      {
        $group: {
          _id: { $ifNull: ["$kategori", "Lainnya"] },
          total: { $sum: "$jumlah" },
        },
      },
    ]);

    const stokDistribusi = stokDistribusiRaw.map((d) => ({
      _id: d._id ?? "Lainnya",
      total: d.total,
    }));

    // BARANG TERLARIS
    const barangTerlaris = await Penjualan.aggregate([
      { $match: { periode } },
      {
        $group: {
          _id: "$nama_item",
          total_jual: { $sum: "$jumlah" },
          total_nilai: { $sum: "$total_harga" },
        },
      },
      { $sort: { total_jual: -1 } },
      { $limit: 10 },
    ]);
// PREDIKSI BARANG TERLARIS
let prediksiBarangTerlarisBulanDepan = [];
let prediksiBarangTerlarisTahunDepan = [];

if (barangTerlaris.length > 0) {
  const growthRateBulanan = 0.1; // misal naik 10% bulan depan
  const growthRateTahunan = 0.25; // misal naik 25% tahun depan

  prediksiBarangTerlarisBulanDepan = barangTerlaris.map(item => ({
    ...item,
    prediksi_jumlah: Math.round(item.total_jual * (1 + growthRateBulanan)),
    periode_prediksi: `${tahunSekarang}-${monthNumToName[parsePeriode(periode).bulan + 1] || "Januari"}`,
  }));

  prediksiBarangTerlarisTahunDepan = barangTerlaris.map(item => ({
    ...item,
    prediksi_jumlah: Math.round(item.total_jual * (1 + growthRateTahunan)),
    periode_prediksi: `${tahunPrediksi}`,
  }));
}

    // RESPON FINAL (tanpa tambahan)
    res.json({
      periode,
      totalPembelian,
      totalPenjualan,
      totalRetur: { total: totalRetur, jumlah: jumlahRetur, persentase: persentaseRetur },
      labaRugi,
      totalStokOpname,
      trend: { pembelian: trendPembelian, penjualan: trendPenjualan },
      stokDistribusi,
      barangTerlaris,
      prediksi: {
  tahunPrediksi,
  bulanBerikutnya: prediksiBarangTerlarisBulanDepan,
  barangTerlarisFinal: prediksiBarangTerlarisTahunDepan,
  labaTahunDepan: prediksiLabaTahunDepan,
  keuntunganTahunan: { tahunPrediksi, estimasi: prediksiLabaTahunDepan },
},
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
});

// === EKSPOR KE EXCEL ===
// === EKSPOR DASHBOARD LENGKAP KE EXCEL (1 Sheet, banyak section, styling clean) ===
// === EKSPOR DASHBOARD KE EXCEL (Sinkron dengan getDashboardSummary) ===
export const exportDashboardExcel = asyncHandler(async (req, res) => {
  const { periode } = req.query;
  if (!periode) {
    res.status(400);
    throw new Error("Periode wajib diisi. Contoh format: 2025-Januari");
  }

  const tahunSekarang = parseInt(periode.split("-")[0], 10);
  const tahunPrediksi = tahunSekarang + 1;

  // === AGGREGASI UTAMA ===
  const [pembelianAgg, penjualanAgg, returAgg, stokAgg] = await Promise.all([
    Pembelian.aggregate([{ $match: { periode } }, { $group: { _id: null, total: { $sum: "$total_harga" } } }]),
    Penjualan.aggregate([{ $match: { periode } }, { $group: { _id: null, total: { $sum: "$total_harga" } } }]),
    Retur.aggregate([
      { $match: { periode } },
      { $group: { _id: null, total: { $sum: "$total_harga" }, jumlah: { $sum: "$jumlah" } } },
    ]),
    Stok.aggregate([{ $match: { periode } }, { $group: { _id: null, total: { $sum: "$qty_fisik" } } }]),
  ]);

  const totalPembelian = pembelianAgg[0]?.total || 0;
  const totalPenjualan = penjualanAgg[0]?.total || 0;
  const totalRetur = returAgg[0]?.total || 0;
  const jumlahRetur = returAgg[0]?.jumlah || 0;
  const totalStokOpname = stokAgg[0]?.total || 0;

  const labaRugi = totalPenjualan - totalPembelian;
  const persentaseRetur = totalPenjualan
    ? ((totalRetur / totalPenjualan) * 100).toFixed(2)
    : "0.00";

  // === BARANG TERLARIS & PREDIKSI ===
  const barangTerlaris = await Penjualan.aggregate([
    { $match: { periode } },
    {
      $group: {
        _id: "$nama_item",
        total_jual: { $sum: "$jumlah" },
        total_nilai: { $sum: "$total_harga" },
      },
    },
    { $sort: { total_jual: -1 } },
    { $limit: 10 },
  ]);

  const growthRateTahunan = 0.25; // estimasi kenaikan 25%
  const prediksiBarangTerlarisTahunDepan = barangTerlaris.map((item) => ({
    produk: item._id,
    prediksi_jumlah: Math.round(item.total_jual * (1 + growthRateTahunan)),
    periode_prediksi: `${tahunPrediksi}`,
  }));

  // === TREND ===
  const [trendPembelian, trendPenjualan] = await Promise.all([
    Pembelian.aggregate([{ $group: { _id: "$periode", total: { $sum: "$total_harga" } } }]),
    Penjualan.aggregate([{ $group: { _id: "$periode", total: { $sum: "$total_harga" } } }]),
  ]);

  // === LABA BULANAN & PREDIKSI LABA TAHUN DEPAN ===
  const labaBulanan = trendPenjualan.map((t, i) => {
    const pembelian = trendPembelian[i]?.total || 0;
    return t.total - pembelian;
  });

  const validLaba = labaBulanan.filter((v) => !isNaN(v) && v !== 0);
  const totalLaba = validLaba.reduce((a, b) => a + b, 0);
  const rataLaba = validLaba.length ? totalLaba / validLaba.length : 0;
  const prediksiLabaTahunDepan = Math.round(rataLaba * 12);

  // === FORMATTER ===
  const formatRupiah = (num) =>
    "Rp " + (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // === EXCEL ===
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Dashboard Summary");

  // HEADER
  sheet.mergeCells("A1", "E1");
  sheet.getCell("A1").value = `Laporan Dashboard (${periode})`;
  sheet.getCell("A1").font = { size: 16, bold: true };
  sheet.getCell("A1").alignment = { horizontal: "center" };

  let row = 3;

  const addTitle = (title) => {
    sheet.getRow(row).values = [title];
    sheet.getRow(row).font = { bold: true };
    sheet.getRow(row).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9E1F2" } };
    row += 2;
  };

  const addTable = (headers, data) => {
    sheet.getRow(row).values = headers;
    sheet.getRow(row).font = { bold: true };
    row++;
    data.forEach((r) => {
      sheet.getRow(row).values = r;
      row++;
    });
    row++;
  };

  // === SECTION: Ringkasan Keuangan ===
  addTitle("📊 RINGKASAN KEUANGAN");
  addTable(["Keterangan", "Nilai"], [
    ["Total Pembelian", formatRupiah(totalPembelian)],
    ["Total Penjualan", formatRupiah(totalPenjualan)],
    ["Total Retur", formatRupiah(totalRetur)],
    ["Jumlah Retur", jumlahRetur + " pcs"],
    ["Persentase Retur", persentaseRetur + "%"],
    ["Total Stok Opname", totalStokOpname],
    ["Laba / Rugi", formatRupiah(labaRugi)],
  ]);

  // === SECTION: Barang Terlaris ===
  addTitle("🛒 BARANG TERLARIS");
  addTable(
    ["No", "Produk", "Jumlah Terjual", "Total Nilai"],
    barangTerlaris.map((b, i) => [
      i + 1,
      b._id,
      b.total_jual,
      formatRupiah(b.total_nilai),
    ])
  );

  // === SECTION: Prediksi Barang Terlaris Tahun Depan ===
  addTitle("🔮 PREDIKSI BARANG TERLARIS (TAHUN DEPAN)");
  addTable(
    ["No", "Produk", "Prediksi Jumlah", "Periode Prediksi"],
    prediksiBarangTerlarisTahunDepan.map((p, i) => [
      i + 1,
      p.produk,
      p.prediksi_jumlah,
      p.periode_prediksi,
    ])
  );

  // === SECTION: Prediksi Keuntungan ===
  addTitle("💰 PREDIKSI LABA TAHUN DEPAN");
  addTable(["Keterangan", "Nilai"], [
    ["Perkiraan Laba / Rugi Tahun Depan", formatRupiah(prediksiLabaTahunDepan)],
  ]);

  // === LEBAR KOLOM OTOMATIS ===
  sheet.columns.forEach((col) => {
    let max = 0;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value ? cell.value.toString().length : 10;
      if (len > max) max = len;
    });
    col.width = max + 5;
  });

  // === KIRIM FILE ===
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=dashboard-summary-${periode}.xlsx`
  );
  await workbook.xlsx.write(res);
  res.end();
});

