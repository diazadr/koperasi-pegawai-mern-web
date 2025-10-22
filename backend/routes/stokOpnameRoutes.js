import express from 'express'
import {
  getStokOpname,
  createStokOpname,
  deleteStokOpnameByPeriode
} from '../controllers/stokOpnameController.js'

const router = express.Router()

router.get('/', getStokOpname)
router.post('/', createStokOpname)
router.delete('/', deleteStokOpnameByPeriode)

export default router
