import mongoose from 'mongoose'

const penjualanSchema = new mongoose.Schema({
  kode_item: { type: String, required: true },
  nama_item: { type: String, required: true },
  jenis: { type: String },
  merek: { type: String, default: 'Tidak Ada' },
  jumlah: { type: Number, required: true },
  satuan: { type: String },
  total_harga: { type: Number, required: true },
  tanggal: { type: Date, required: true },
  periode: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model('Penjualan', penjualanSchema)
