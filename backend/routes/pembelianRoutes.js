import express from 'express';
import {
  getPembelian,
  createPembelian,
  deletePembelianByPeriode,
  getPembelianAggregate,
} from '../controllers/pembelianController.js';

const router = express.Router();

/**
 * @route   GET /api/pembelian
 * @desc    Ambil data pembelian berdasarkan periode & filter opsional
 * @access  Public
 */
router.get('/', getPembelian);

/**
 * @route   POST /api/pembelian
 * @desc    Import batch data pembelian (per-periode)
 * @access  Public
 */
router.post('/', createPembelian);

/**
 * @route   DELETE /api/pembelian
 * @desc    Hapus semua data pembelian berdasarkan periode (?periode=2025-10)
 * @access  Public
 */
router.delete('/', deletePembelianByPeriode);

/**
 * @route   GET /api/pembelian/aggregate
 * @desc    Agregasi pembelian per supplier untuk analitik big data
 * @access  Public
 */
router.get('/aggregate', getPembelianAggregate);

export default router;
