import asyncHandler from 'express-async-handler'
import Retur from '../models/returModel.js'

/**
 * @desc  Ambil data retur per periode
 * @route GET /api/retur?periode=2025-10
 */
export const getRetur = asyncHandler(async (req, res) => {
  const { periode } = req.query

  // 🔒 Filter periode wajib
  if (!periode) {
    return res.status(400).json({ message: 'Parameter "periode" wajib diisi' })
  }

  const data = await Retur.find({ periode }).sort({ nama_item: 1 })
  res.json(data)
})

/**
 * @desc  Tambah banyak data retur (batch per-periode)
 * @route POST /api/retur
 */
export const createRetur = asyncHandler(async (req, res) => {
  const newData = Array.isArray(req.body) ? req.body : [req.body]

  if (newData.length === 0) {
    res.status(400)
    throw new Error('Data retur kosong')
  }

  // Validasi periode wajib di setiap record
  for (const item of newData) {
    if (!item.periode) {
      res.status(400)
      throw new Error('Setiap record retur wajib memiliki "periode"')
    }
  }

  // 🚀 Bulk insert efisien untuk big data
  const inserted = await Retur.insertMany(newData, { ordered: false })

  res.status(201).json({
    message: `Berhasil menyimpan ${inserted.length} data retur.`,
    count: inserted.length,
  })
})

/**
 * @desc  Hapus semua data retur per periode
 * @route DELETE /api/retur?periode=2025-10
 */
export const deleteReturByPeriode = asyncHandler(async (req, res) => {
  const { periode } = req.query
  if (!periode) {
    res.status(400)
    throw new Error('Parameter "periode" wajib diisi')
  }

  const result = await Retur.deleteMany({ periode })
  res.json({
    message: `Data retur periode ${periode} berhasil dihapus.`,
    deleted: result.deletedCount,
  })
})

/**
 * @desc  Agregasi total retur per item (analitik big data)
 * @route GET /api/retur/aggregate?periode=2025-10
 */
export const getReturAggregate = asyncHandler(async (req, res) => {
  const { periode } = req.query
  if (!periode) {
    res.status(400)
    throw new Error('Parameter "periode" wajib diisi')
  }

  const agg = await Retur.aggregate([
    { $match: { periode } },
    {
      $group: {
        _id: '$nama_item',
        total_retur: { $sum: '$total_harga' },
        total_item: { $sum: '$jumlah' },
        jumlah_transaksi: { $count: {} },
      },
    },
    { $sort: { total_retur: -1 } },
  ])

  res.json(agg)
})
