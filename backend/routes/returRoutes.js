import express from 'express'
import {
  getRetur,
  createRetur,
  deleteReturByPeriode,
  getReturAggregate,
} from '../controllers/returController.js'

const router = express.Router()

/**
 * @route   GET /api/retur
 * @desc    Ambil data retur berdasarkan periode
 * @access  Public
 */
router.get('/', getRetur)

/**
 * @route   POST /api/retur
 * @desc    Import batch data retur (per-periode)
 * @access  Public
 */
router.post('/', createRetur)

/**
 * @route   DELETE /api/retur
 * @desc    Hapus semua data retur berdasarkan periode (?periode=2025-10)
 * @access  Public
 */
router.delete('/', deleteReturByPeriode)

/**
 * @route   GET /api/retur/aggregate
 * @desc    Agregasi total retur per item (analitik big data)
 * @access  Public
 */
router.get('/aggregate', getReturAggregate)

export default router
