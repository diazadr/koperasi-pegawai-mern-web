import mongoose from 'mongoose'

const pembelianSchema = new mongoose.Schema({
  kode_item: { type: String, required: true },
  nama_item: { type: String, required: true },
  jenis: { type: String },
  jumlah: { type: Number, required: true },
  satuan: { type: String },
  total_harga: { type: Number, required: true },
  tanggal: { type: Date, required: true },
  periode: { type: String, required: true }, // format YYYY-MM
}, { timestamps: true })

export default mongoose.model('Pembelian', pembelianSchema)
