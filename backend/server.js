import express from 'express'
import dotenv from 'dotenv'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import pembelianRoutes from './routes/pembelianRoutes.js'
import penjualanRoutes from './routes/penjualanRoutes.js'
import returRoutes from './routes/returRoutes.js'
import stokOpnameRoutes from './routes/stokOpnameRoutes.js'
import uploadBulananRoutes from './routes/uploadBulananRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config()
connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('Server is running...'))

// ROUTES API
app.use('/api/pembelian', pembelianRoutes)
app.use('/api/penjualan', penjualanRoutes)
app.use('/api/retur', returRoutes)
app.use('/api/stok_opname', stokOpnameRoutes)
app.use('/api/upload-bulanan', uploadBulananRoutes)
app.use('/api/dashboard', dashboardRoutes);

// Middleware error
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


