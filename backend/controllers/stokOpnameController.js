import asyncHandler from 'express-async-handler'
import StokOpname from '../models/stokOpnameModel.js'

export const getStokOpname = asyncHandler(async (req, res) => {
  const { periode } = req.query
  const filter = periode ? { periode } : {}
  const data = await StokOpname.find(filter).sort({ tanggal: -1 })
  res.json(data)
})

export const createStokOpname = asyncHandler(async (req, res) => {
  const newData = Array.isArray(req.body) ? req.body : [req.body]
  const inserted = await StokOpname.insertMany(newData)
  res.status(201).json({
    message: 'Data stok opname berhasil disimpan',
    count: inserted.length
  })
})

export const deleteStokOpnameByPeriode = asyncHandler(async (req, res) => {
  const { periode } = req.query
  if (!periode) {
    res.status(400)
    throw new Error('Periode wajib diisi')
  }
  const result = await StokOpname.deleteMany({ periode })
  res.json({ message: `Data stok opname periode ${periode} dihapus`, deleted: result.deletedCount })
})
