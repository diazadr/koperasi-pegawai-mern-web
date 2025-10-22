import mongoose from "mongoose";

const stokOpnameSchema = new mongoose.Schema(
  {
    kode_item: { type: String, default: null },
    nama_item: { type: String, required: true },
    qty_fisik: { type: Number, required: true },
    qty_sistem: { type: Number, default: 0 },
    selisih: { type: Number, default: 0 },
    satuan: { type: String, default: "PCS" },
    periode: { type: String, required: true },
    tanggal: { type: Date, required: true },
  },
  {
    timestamps: true,
    strict: true, // <-- ini penting, menolak field di luar schema
  }
)


export default mongoose.model("StokOpname", stokOpnameSchema);
