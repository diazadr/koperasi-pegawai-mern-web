import express from 'express'
import upload from '../middleware/uploadMiddleware.js'
import { uploadBulanan, getDaftarPeriode } from '../controllers/uploadBulananController.js'

const router = express.Router()

// Gunakan multer untuk multiple field upload
const uploadFields = upload.fields([
  { name: 'pembelian', maxCount: 1 },
  { name: 'penjualan', maxCount: 1 },
  { name: 'retur', maxCount: 1 },
  { name: 'stok_opname', maxCount: 2 },
])

router.post('/', (req, res, next) => {
  console.log("🔥 ROUTER TERPANGGIL - masuk sebelum multer");
  next();
}, uploadFields, uploadBulanan)

router.get('/periode/list', getDaftarPeriode)
export default router
