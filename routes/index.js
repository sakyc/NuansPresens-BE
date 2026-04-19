import express from 'express';
import '../models/jabatan/index.js'; // tr table jabatan
import '../models/shift/index.js'; // tr table shift
import '../models/divisi/index.js'; // tr table divisi
import '../models/kategory_absensi/index.js'; // tr table kategory absen
import '../models/users/index.js'; // tm table users
import '../models/karyawan/index.js'; // tm table karyawan
import '../models/qr_absensi/index.js'; // tm table qr_absensi
import '../models/absensi/index.js'; // tm table absensi
import '../models/presensi/index.js'; // tm table presensi
import '../models/TABLE_PENILAIAN/kategori_penilaian/index.js'; // 
import '../models/TABLE_PENILAIAN/penilaian/index.js'; // 
import '../models/TABLE_PENILAIAN/detail_penilaian/index.js'; // 
import '../models/TABLE_PENILAIAN/periode_penilaian/index.js'; // 
import '../models/TABLE_POINT/point_katalog_item/index.js'; //
import '../models/TABLE_POINT/point_riwayat/index.js';
import '../models/TABLE_POINT/user_token/index.js';
import '../models/TABLE_POINT/point_rules/index.js';


import {
  addKaryawan,
  chectPassword,
  getKaryawan,
  getKaryawanById,
  updateKaryawan,
  deleteKaryawan
} from '../controller/karyawan/index.js';
import {
  getJabatan,
  getJabatanById,
  createJabatan,
  updateJabatan,
  deleteJabatan
} from '../controller/jabatan/index.js';
import { closeQr, dinamisQr, getQr_status } from '../controller/qr_absen/index.js';
import { seederShift } from '../controller/shift/index.js';
import { PresensiCheckin, PresensiCheckout } from '../controller/transaksi/presensi/index.js';
import Seeder from '../controller/seeder/index.js';
import { login } from '../controller/auth/karyawan/index.js';
import { login as loginDashboard } from '../controller/auth/dashboard/index.js';
import { PengajuanAbsensi, UpdateAbsensi } from '../controller/transaksi/absensi/index.js';
import { GetPengajuan } from '../controller/absensi/index.js';
import { createUsers } from '../controller/users/index.js';
import seedKategoriPenilaian from '../controller/penilaian/seeder-penilaian.js';
import { generatePeriode, getAllPeriode, getPeriodeByRole, updatePeriode } from '../controller/penilaian/generate-penilaian/index.js';
import { getKategori_penilaian} from '../controller/penilaian/kategory/index.js';
import { simpanDetailPenilaian } from '../controller/penilaian/transaksi/index.js';
import { test_selisih } from '../controller/api_testing/index.js';
import { bonusPoint, getKaryawanToken, getKatalog, getpoint, getRanking, getRiwayat, redeemPoint } from '../controller/sistem_point/index.js';
import seeder_karyawan_user from '../controller/karyawan/seeder/index.js';

let router = express.Router();

//testing
router.get('/test', test_selisih)
//seeder
router.get('/seeder-112', Seeder);
router.get('/seeder-penilaian', seedKategoriPenilaian);
router.get('/seeder-karyawan-user', seeder_karyawan_user);
//sistem point
router.get('/api/get-point', getpoint);
router.get('/api/get-riwayat-point', getRiwayat);
router.get('/api/get-ranking', getRanking);
router.get('/api/get-katalog', getKatalog);
router.get('/api/get-karyawan-token', getKaryawanToken);
router.post('/api/redeem-point', redeemPoint);
router.post('/api/bonus-point', bonusPoint);

//penilaian
router.post('/api/generate-penilaian', generatePeriode);
router.get('/api/get-all-periode/:userId', getAllPeriode);
router.post('/api/get-penilaian-by-periode', getPeriodeByRole);
router.post('/api/update-periode', updatePeriode);
router.get('/api/kategori-penilaian', getKategori_penilaian);
router.post('/api/simpan-penilaian', simpanDetailPenilaian);
//karyawan
router.post('/api/add-karyawan', addKaryawan); 
router.get('/api/karyawan', getKaryawan);
router.get('/api/karyawan/:id', getKaryawanById);
router.put('/api/karyawan/:id', updateKaryawan);
router.delete('/api/karyawan/:id', deleteKaryawan);
router.get('/check-password', chectPassword);

//jabatan
router.get('/api/jabatan', getJabatan);
router.get('/api/jabatan/:id', getJabatanById);
router.post('/api/jabatan', createJabatan);
router.put('/api/jabatan/:id', updateJabatan);
router.delete('/api/jabatan/:id', deleteJabatan);
//users
router.post('/api/create-users', createUsers);

//auth karyawwan
router.post('/api/auth-employe', login);
//auth dashboard
router.post('/api/admin/login', loginDashboard);


// transaksi presensi
router.post('/api/presensi/check-in', PresensiCheckin);
router.post('/api/presensi/check-out', PresensiCheckout);
// transaksi absensi
router.get('/api/get-pengajuan', GetPengajuan); 
router.post('/api/absensi', PengajuanAbsensi)
router.post('/api/update-absensi', UpdateAbsensi);

//qr absen
router.post('/api/generate-qr', dinamisQr);
router.post('/api/qr-status', getQr_status);
router.post('/api/close-qr', closeQr);

//shift
router.get('/seeder-shift', seederShift);

//tester
router.get('/', (req, res) => {
  res.send('API is running...');
});

export default router;
