import asyncHandler from 'express-async-handler';
import Pembelian from '../models/pembelianModel.js';

/**
 * @desc  Ambil data pembelian per periode (opsional filter jenis)
 * @route GET /api/pembelian?periode=2025-Januari&jenis=MKN
 */
export const getPembelian = asyncHandler(async (req, res) => {
  const { periode, jenis } = req.query;

  if (!periode) {
    return res.status(400).json({ message: 'Parameter "periode" wajib diisi (misal: 2025-Januari)' });
  }

  const filter = { periode };
  if (jenis) filter.jenis = jenis;

  const data = await Pembelian.find(filter).sort({ nama_item: 1 });
  res.json(data);
});

/**
 * @desc  Tambah banyak data pembelian (import batch per-periode)
 * @route POST /api/pembelian
 */
import dayjs from "dayjs";

export const createPembelian = asyncHandler(async (req, res) => {
  const newData = Array.isArray(req.body) ? req.body : [req.body];

  if (!newData.length) {
    return res.status(400).json({ message: "Data pembelian kosong." });
  }

  for (const item of newData) {
    if (!item.periode || !/^\d{4}-[A-Za-z]+$/.test(item.periode)) {
      return res.status(400).json({
        message: `Format periode tidak valid: ${item.periode}. Gunakan format seperti "2025-Januari".`,
      });
    }

    // 💡 Tambahkan tanggal otomatis (tanggal 1 di bulan itu)
    if (!item.tanggal) {
      const [tahun, bulanNama] = item.periode.split("-");
      const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      const bulanIndex = monthNames.indexOf(bulanNama);
      if (bulanIndex === -1) {
        return res.status(400).json({ message: `Nama bulan tidak valid: ${bulanNama}` });
      }
      item.tanggal = dayjs(`${tahun}-${bulanIndex + 1}-01`).toDate();
    }
  }

  try {
    const inserted = await Pembelian.insertMany(newData, { ordered: true });

    if (!inserted.length) {
      return res.status(400).json({ message: "Tidak ada data yang tersimpan." });
    }

    res.status(201).json({
      message: `Berhasil menyimpan ${inserted.length} data pembelian.`,
      count: inserted.length,
    });
  } catch (err) {
    console.error("Insert pembelian error:", err);
    res.status(500).json({
      message: "Gagal menyimpan data pembelian.",
      error: err.message,
    });
  }
});


/**
 * @desc  Hapus semua data pembelian per periode
 * @route DELETE /api/pembelian?periode=2025-Januari
 */
export const deletePembelianByPeriode = asyncHandler(async (req, res) => {
  const { periode } = req.query;

  if (!periode) {
    res.status(400);
    throw new Error('Parameter "periode" wajib diisi (misal: 2025-Januari)');
  }

  const result = await Pembelian.deleteMany({ periode });
  res.json({
    message: `Data pembelian periode ${periode} berhasil dihapus.`,
    deleted: result.deletedCount,
  });
});

/**
 * @desc  Agregasi total pembelian per jenis (analitik sederhana)
 * @route GET /api/pembelian/aggregate?periode=2025-Januari
 */
export const getPembelianAggregate = asyncHandler(async (req, res) => {
  const { periode } = req.query;

  if (!periode) {
    res.status(400);
    throw new Error('Parameter "periode" wajib diisi (misal: 2025-Januari)');
  }

  const agg = await Pembelian.aggregate([
    { $match: { periode } },
    {
      $group: {
        _id: '$jenis',
        total_pembelian: { $sum: '$total_harga' },
        total_item: { $sum: '$jumlah' },
        jumlah_transaksi: { $sum: 1 },
      },
    },
    { $sort: { total_pembelian: -1 } },
  ]);

  res.json(agg);
});
