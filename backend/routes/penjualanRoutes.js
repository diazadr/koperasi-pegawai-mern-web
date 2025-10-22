import express from 'express';
import {
  getPenjualan,
  createPenjualan,
  deletePenjualanByPeriode,
  getPenjualanAggregate,
} from '../controllers/penjualanController.js';

const router = express.Router();

/**
 * @route   GET /api/penjualan
 * @desc    Ambil data penjualan berdasarkan periode & filter opsional
 * @access  Public
 */
router.get('/', getPenjualan);

/**
 * @route   POST /api/penjualan
 * @desc    Import batch data penjualan (per-periode)
 * @access  Public
 */
router.post('/', createPenjualan);

/**
 * @route   DELETE /api/penjualan
 * @desc    Hapus semua data penjualan berdasarkan periode (?periode=2025-10)
 * @access  Public
 */
router.delete('/', deletePenjualanByPeriode);

/**
 * @route   GET /api/penjualan/aggregate
 * @desc    Agregasi penjualan per jenis & merek untuk analitik big data
 * @access  Public
 */
router.get('/aggregate', getPenjualanAggregate);

export default router;
