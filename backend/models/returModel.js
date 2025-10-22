import mongoose from 'mongoose'

const returSchema = new mongoose.Schema({
  kode_item: { type: String, required: true },
  nama_item: { type: String, required: true },
  jumlah: { type: Number, required: true },
  satuan: { type: String },
  harga_satuan: { type: Number },
  potongan: { type: Number, default: 0 }, // diskon/potongan
  total_harga: { type: Number, required: true },
  tanggal: { type: Date, required: true },
  periode: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model('Retur', returSchema)
