import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

dotenv.config()
connectDB()

const app = express()

// CORS FIX
const allowedOrigins = [
  "http://localhost:3000",
  "https://koperasi-pegawai-mern-web.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: false
}));

// Tambahan headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('Server is running...'))

// ROUTES API
app.use('/api/pembelian', pembelianRoutes)
app.use('/api/penjualan', penjualanRoutes)
app.use('/api/retur', returRoutes)
app.use('/api/stok_opname', stokOpnameRoutes)
app.use('/api/upload-bulanan', uploadBulananRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
