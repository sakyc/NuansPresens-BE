import express from 'express';
import '../models/users/index.js';
import '../models/karyawan/index.js';
import '../models/qr_absensi/index.js';
import '../models/shift/index.js';
import '../models/presensi/index.js';
import { getKaryawan, addKaryawan } from '../controller/karyawan/index.js';
import { dinamisQr, SeederQR } from '../controller/qr_absen/index.js';
import { seederShift } from '../controller/shift/index.js';
import { getPresensi } from '../controller/transaksi/presensi/index.js';

let router = express.Router();

// transaksi presensi
router.post('/api/presensi', getPresensi);
//users

//karyawan
router.get('/api/karyawan', getKaryawan);
router.post('/api/add-karyawan', addKaryawan);

//qr absen
router.post("/api/generate-qr", dinamisQr);
router.get("/seeder-qr", SeederQR);

//shift
router.get("/seeder-shift", seederShift);


//tester
router.get('/', (req, res) => {
    res.send('API is running...');
});

export default router;


