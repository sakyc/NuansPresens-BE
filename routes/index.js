import express from 'express';
import '../models/jabatan/index.js' // tr table jabatan
import '../models/shift/index.js'; // tr table shift
import '../models/divisi/index.js' // tr table divisi
import '../models/kategory_absensi/index.js' // tr table kategory absen
import '../models/users/index.js'; // tm table users
import '../models/karyawan/index.js'; // tm table karyawan
import '../models/qr_absensi/index.js'; // tm table qr_absensi
import '../models/absensi/index.js' // tm table absensi 
import '../models/presensi/index.js'; // tm table presensi 


import { getKaryawan, addKaryawan } from '../controller/karyawan/index.js';
import { dinamisQr, SeederQR } from '../controller/qr_absen/index.js';
import { seederShift } from '../controller/shift/index.js';
import { getPresensi } from '../controller/transaksi/presensi/index.js';
import { seederJabatan } from '../controller/jabatan/inde.js';

let router = express.Router();


// jabatan
router.get("/seeder-jabatan", seederJabatan);

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


