import asyncHandler from 'express-async-handler'
import { parseCSV } from '../utils/csvParser.js'
import { parseXLSX } from '../utils/xlsxParser.js'
import { normalizeDataSync, normalizeStokOpname } from '../utils/normalizer.js'
import Pembelian from '../models/pembelianModel.js'
import Penjualan from '../models/penjualanModel.js'
import Retur from '../models/returModel.js'
import Stok from '../models/stokOpnameModel.js'



export const uploadBulanan = asyncHandler(async (req, res) => {
  console.log("========== UPLOAD BULANAN ==========")
  console.log("BODY:", req.body)
  console.log("FILES:", Object.keys(req.files || {}))

  const { bulan, tahun } = req.body
  if (!bulan || !tahun) {
    res.status(400)
    throw new Error('Bulan dan tahun wajib diisi')
  }

  const periode = `${tahun}-${bulan.toString().padStart(2, '0')}`
  console.log("PERIODE:", periode)

  if (!req.files) {
    res.status(400)
    throw new Error('Tidak ada file diunggah')
  }

  // ================= PEMBELIAN =================
  if (req.files.pembelian) {
    await Pembelian.deleteMany({ periode })
    const pembelianData = await parseCSV(req.files.pembelian[0].path)
    const normalized = normalizeDataSync(pembelianData, 'pembelian', periode)
    if (normalized.length > 0) await Pembelian.insertMany(normalized)
  }

  // ================= PENJUALAN =================
  if (req.files.penjualan) {
    await Penjualan.deleteMany({ periode })
    const penjualanData = await parseCSV(req.files.penjualan[0].path)
    const normalized = normalizeDataSync(penjualanData, 'penjualan', periode)
    if (normalized.length > 0) await Penjualan.insertMany(normalized)
  }

  // ================= RETUR =================
  if (req.files.retur) {
    await Retur.deleteMany({ periode })
    const returData = await parseCSV(req.files.retur[0].path)
    const normalized = normalizeDataSync(returData, 'retur', periode)
    if (normalized.length > 0) await Retur.insertMany(normalized)
  }

  // ================= STOK OPNAME =================
  if (req.files.stok_opname && req.files.stok_opname.length > 0) {
    await Stok.deleteMany({
      periode,
      $or: [{ sumber: 'stok_opname' }, { sumber: { $exists: false } }],
    })

    let allSheets = []
    for (const file of req.files.stok_opname) {
      const parsed = parseXLSX(file.path)
      allSheets.push(...parsed.map(sheet => ({ ...sheet, file_asal: file.originalname })))
    }

    const normalized = await normalizeStokOpname(allSheets, periode)
    if (normalized.length > 0) await Stok.insertMany(normalized)
  }

  console.log("========== UPLOAD SELESAI ==========\n")
  res.status(200).json({
    message: `Data periode ${periode} berhasil diperbarui (replace & insert).`,
  })
})



// ================= GET DAFTAR PERIODE =================
export const getDaftarPeriode = asyncHandler(async (req, res) => {
  const [pemb, penj, ret, stok] = await Promise.all([
    Pembelian.distinct('periode'),
    Penjualan.distinct('periode'),
    Retur.distinct('periode'),
    Stok.distinct('periode'),
  ]);

  // Gabungkan semua periode tanpa duplikat
  const all = [...new Set([...pemb, ...penj, ...ret, ...stok])];

  // Konversi nama bulan ke urutan angka
  const monthOrder = {
    Januari: 1,
    Februari: 2,
    Maret: 3,
    April: 4,
    Mei: 5,
    Juni: 6,
    Juli: 7,
    Agustus: 8,
    September: 9,
    Oktober: 10,
    November: 11,
    Desember: 12,
  };

  // Urutkan dari tahun lama ke tahun baru, bulan Januari ke Desember
  const sorted = all.sort((a, b) => {
    const [tahunA, bulanA] = a.split("-");
    const [tahunB, bulanB] = b.split("-");

    const yearDiff = parseInt(tahunA) - parseInt(tahunB);
    if (yearDiff !== 0) return yearDiff;

    return monthOrder[bulanA] - monthOrder[bulanB];
  });

  // Buat hasil akhir dengan status masing-masing tabel
  const hasil = sorted.map((periode) => ({
    periode,
    pembelian: pemb.includes(periode),
    penjualan: penj.includes(periode),
    retur: ret.includes(periode),
    stokopname: stok.includes(periode),
  }));

  res.json(hasil);
});

