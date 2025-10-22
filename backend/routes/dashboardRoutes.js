import express from 'express'
import { getDashboardSummary, exportDashboardExcel } from '../controllers/dashboardController.js'

const router = express.Router()

router.get("/", getDashboardSummary);
router.get("/export-excel", exportDashboardExcel);

export default router