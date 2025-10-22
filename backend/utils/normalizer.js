import dayjs from 'dayjs'
import { toNumberSafe } from './numberSanitizer.js'
import Pembelian from '../models/pembelianModel.js'
import Penjualan from '../models/penjualanModel.js'
import Retur from '../models/returModel.js'

// Mapping nama bulan ke angka
const monthMap = {
  Januari: '01',
  Februari: '02',
  Maret: '03',
  April: '04',
  Mei: '05',
  Juni: '06',
  Juli: '07',
  Agustus: '08',
  September: '09',
  Oktober: '10',
  November: '11',
  Desember: '12',
}

// Helper: ubah periode "2025-April" → "2025-04-01"
const getValidDateFromPeriode = (periode) => {
  const [tahun, bulanNama] = periode.split('-')
  const bulanAngka = monthMap[bulanNama]
  if (!bulanAngka) return new Date('Invalid Date')
  return dayjs(`${tahun}-${bulanAngka}-01`).toDate()
}

// helper untuk hitung stok sistem per nama_item (case-insensitive)
const getQtySistem = async (nama_item, periode) => {
  const namaTrimmed = String(nama_item || '').trim()

  const [pembelian, penjualan, retur] = await Promise.all([
    Pembelian.aggregate([
      { $match: { nama_item: { $regex: `^${namaTrimmed}$`, $options: 'i' }, periode } },
      { $group: { _id: null, total: { $sum: "$jumlah" } } }
    ]),
    Penjualan.aggregate([
      { $match: { nama_item: { $regex: `^${namaTrimmed}$`, $options: 'i' }, periode } },
      { $group: { _id: null, total: { $sum: "$jumlah" } } }
    ]),
    Retur.aggregate([
      { $match: { nama_item: { $regex: `^${namaTrimmed}$`, $options: 'i' }, periode } },
      { $group: { _id: null, total: { $sum: "$jumlah" } } }
    ])
  ])

  const totalPembelian = pembelian[0]?.total || 0
  const totalPenjualan = penjualan[0]?.total || 0
  const totalRetur = retur[0]?.total || 0

  return Math.max(totalPembelian - totalPenjualan - totalRetur, 0)
}

// ================= SYNC untuk CSV =================
export const normalizeDataSync = (data, type, periode) => {
  const defaultDate = getValidDateFromPeriode(periode)

  switch (type) {
    case 'pembelian':
      return data.filter(i => i['Nama Item']).map(i => ({
        kode_item: String(i['Kode Item'] || '').trim(),
        nama_item: String(i['Nama Item'] || 'UNKNOWN').trim(),
        jenis: i['Jenis'] || 'UNKNOWN',
        jumlah: toNumberSafe(i['Jumlah']),
        satuan: i['Satuan'] || 'UNKNOWN',
        total_harga: toNumberSafe(i['Total Harga']),
        tanggal: defaultDate,
        periode,
      }))

    case 'penjualan':
      return data.filter(i => i['Nama Item']).map(i => ({
        kode_item: String(i['Kode Item'] || '').trim(),
        nama_item: String(i['Nama Item'] || 'UNKNOWN').trim(),
        jenis: i['Jenis'] || 'UNKNOWN',
        merek: i['Merek'] || 'Tidak Ada',
        jumlah: toNumberSafe(i['Jumlah']),
        satuan: i['Satuan'] || 'UNKNOWN',
        total_harga: toNumberSafe(i['Total Harga']),
        tanggal: defaultDate,
        periode,
      }))

    case 'retur':
      return data.filter(i => i['Nama Item']).map(i => ({
        kode_item: String(i['Kd. Item'] || '').trim(),
        nama_item: String(i['Nama Item'] || 'UNKNOWN').trim(),
        jumlah: toNumberSafe(i['Jml']),
        satuan: i['Satuan'] || 'UNKNOWN',
        harga_satuan: toNumberSafe(i['Harga']),
        potongan: toNumberSafe(i['Pot. %']) || 0,
        total_harga: toNumberSafe(i['Total']),
        tanggal: defaultDate,
        periode,
      }))

    default:
      return []
  }
}

// ================= ASYNC untuk stok_opname =================
export const normalizeStokOpname = async (data, periode) => {
  const defaultDate = getValidDateFromPeriode(periode)
  const result = []

  for (const sheetData of data) {
    const { sheet, rows } = sheetData
    if (sheet.trim().toLowerCase() !== 'stok opname') continue

    for (const row of rows) {
      const nama = String(row['Nama Barang'] || '').trim()
      if (!nama) continue

      const qtyFisik =
        toNumberSafe(
          row['Qty_SO'] || row['Qty SO'] || row['QTY_SO'] || row['Qty'] || 0
        )

      const qtySistem = await getQtySistem(nama, periode)
      const selisih = qtyFisik - qtySistem

      result.push({
        kode_item: String(row['Kode Item'] || '').trim(),
        nama_item: nama,
        qty_fisik: qtyFisik,
        qty_sistem: qtySistem,
        selisih,
        satuan: 'PCS',
        periode,
        tanggal: defaultDate,
      })
    }
  }

  return result
}
