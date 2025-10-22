import asyncHandler from 'express-async-handler';
import dayjs from "dayjs";
import Penjualan from '../models/penjualanModel.js';

/**
 * @desc  Ambil data penjualan per periode (opsional filter jenis)
 * @route GET /api/penjualan?periode=2025-10&jenis=MKN
 */
export const getPenjualan = asyncHandler(async (req, res) => {
  const { periode, jenis } = req.query;

  // 🔒 Wajib pakai filter periode agar tidak menarik semua data besar
  if (!periode) {
    return res.status(400).json({ message: 'Parameter "periode" wajib diisi' });
  }

  const filter = { periode };
  if (jenis) filter.jenis = jenis;

  const data = await Penjualan.find(filter).sort({ nama_item: 1 });
  res.json(data);
});

/**
 * @desc  Tambah banyak data penjualan (import batch per-periode)
 * @route POST /api/penjualan
 */
export const createPenjualan = asyncHandler(async (req, res) => {
  const newData = Array.isArray(req.body) ? req.body : [req.body];

  if (newData.length === 0) {
    return res.status(400).json({ message: 'Data penjualan kosong.' });
  }

  for (const item of newData) {
    if (!item.periode || !/^\d{4}-[A-Za-z]+$/.test(item.periode)) {
      return res.status(400).json({
        message: `Format periode tidak valid: ${item.periode}. Gunakan format seperti "2025-Januari".`,
      });
    }

    // 💡 Tambahkan tanggal otomatis jika tidak dikirim
    if (!item.tanggal) {
      const [tahun, bulanNama] = item.periode.split('-');
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const bulanIndex = monthNames.indexOf(bulanNama);
      if (bulanIndex === -1) {
        return res.status(400).json({ message: `Nama bulan tidak valid: ${bulanNama}` });
      }
      item.tanggal = dayjs(`${tahun}-${bulanIndex + 1}-01`).toDate();
    }
  }

  try {
    const inserted = await Penjualan.insertMany(newData, { ordered: true });
    res.status(201).json({
      message: `Berhasil menyimpan ${inserted.length} data penjualan.`,
      count: inserted.length,
    });
  } catch (err) {
    console.error('Insert penjualan error:', err);
    res.status(500).json({
      message: 'Gagal menyimpan data penjualan.',
      error: err.message,
    });
  }
});

/**
 * @desc  Hapus semua data penjualan per periode
 * @route DELETE /api/penjualan?periode=2025-10
 */
export const deletePenjualanByPeriode = asyncHandler(async (req, res) => {
  const { periode } = req.query;
  if (!periode) {
    res.status(400);
    throw new Error('Parameter "periode" wajib diisi');
  }

  const result = await Penjualan.deleteMany({ periode });
  res.json({
    message: `Data penjualan periode ${periode} berhasil dihapus.`,
    deleted: result.deletedCount,
  });
});

/**
 * @desc  Agregasi total penjualan per jenis / merek (analitik big data)
 * @route GET /api/penjualan/aggregate?periode=2025-10
 */
export const getPenjualanAggregate = asyncHandler(async (req, res) => {
  const { periode } = req.query;
  if (!periode) {
    res.status(400);
    throw new Error('Parameter "periode" wajib diisi');
  }

  const agg = await Penjualan.aggregate([
    { $match: { periode } },
    {
      $group: {
        _id: { jenis: '$jenis', merek: '$merek' },
        total_penjualan: { $sum: '$total_harga' },
        total_item: { $sum: '$jumlah' },
        jumlah_transaksi: { $count: {} },
      },
    },
    { $sort: { total_penjualan: -1 } },
  ]);

  res.json(agg);
});
