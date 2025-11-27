import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

import pembelianRoutes from "./routes/pembelianRoutes.js";
import penjualanRoutes from "./routes/penjualanRoutes.js";
import returRoutes from "./routes/returRoutes.js";
import stokOpnameRoutes from "./routes/stokOpnameRoutes.js";
import uploadBulananRoutes from "./routes/uploadBulananRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://koperasi-pegawai-mern-web.vercel.app",
  "https://koperasi-pegawai-mern-web.onrender.com",
];

// CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS blocked — origin not allowed"), false);
  },
  credentials: true
}));

app.use((req, res, next) => {
  if (allowedOrigins.includes(req.headers.origin)) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Server is running..."));

app.use("/api/pembelian", pembelianRoutes);
app.use("/api/penjualan", penjualanRoutes);
app.use("/api/retur", returRoutes);
app.use("/api/stok_opname", stokOpnameRoutes);
app.use("/api/upload-bulanan", uploadBulananRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
