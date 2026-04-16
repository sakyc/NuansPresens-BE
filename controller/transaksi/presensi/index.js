import Presensi from '../../../models/presensi/index.js';
import Qr_absensi from '../../../models/qr_absensi/index.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { FlexibilityItemInc, Jabatan, Karyawan, Shift, UserTokenInc } from '../../../models/index.js';
import { Model, Op } from 'sequelize';
import PointRiwayat from '../../../models/TABLE_POINT/point_riwayat/index.js';
import PointRule from '../../../models/TABLE_POINT/point_rules/index.js';

dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

let PresensiCheckin = async (req, res) => {
let { type, id_karyawan, token } = req.body;
const now = dayjs();
const today = now.format('YYYY-MM-DD');

try {
    // 1. Cek apakah sudah absen hari ini
    let sudahAbsen = await Presensi.findOne({
    where: {
        karyawan_id: id_karyawan,
        tanggal: today,
    },
    });

    if (sudahAbsen) {
    return res.status(400).json({ message: 'Kamu sudah absen hari ini' });
    }

    // 2. Ambil data Token QR, Karyawan, dan Shift
    let getToken = await Qr_absensi.findOne({ where: { type: type } });
    let getkaryawan = await Karyawan.findOne({
    where: { id: id_karyawan },
    include: { model: Shift },
    });

    if (!getkaryawan) {
    return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    }

    // 3. Validasi Token QR
    if (!getToken || getToken.token !== token) {
    return res.status(400).json({
        message: 'Token tidak sesuai atau kadaluarsa',
        status: 'gagal',
    });
    }

    // 4. Pengaturan Waktu Shift (Timezone Asia/Jakarta)
    let shift_masuk = getkaryawan.shift.jam_mulai;
    let shift_selesai = getkaryawan.shift.jam_selesai;

    let jam_shift_mulai = dayjs.tz(`${today} ${shift_masuk}`, 'Asia/Jakarta');
    let jam_shift_selesai = dayjs.tz(
    `${today} ${shift_selesai}`,
    'Asia/Jakarta'
    );

    // Mengizinkan absen mulai dari yang ditentukan sebelum shift dimulai
    let check = now.isBetween(
    jam_shift_mulai.subtract(90, 'minute'),
    jam_shift_selesai
    );

    if (!check) {
    return res
        .status(400)
        .json({
        message: 'Terlalu dini atau shift sudah berakhir untuk absen.',
        });
    }

    // 5. Simpan Data Presensi ke Database
    let createPresensi = await Presensi.create({
    karyawan_id: id_karyawan,
    shift_id: getkaryawan.shift_id,
    tanggal: today,
    jam_masuk: now.format('HH:mm:ss'),
    });

    // ... (Bagian awal PresensiCheckin: Cek absen hari ini, ambil data karyawan & shift)

    // 6. LOGIKA POIN DINAMIS
    const selisihMenit = now.diff(jam_shift_mulai, 'minute');
    const rules = await PointRule.findAll({
    order: [['kondisi_value', 'DESC']],
    });

    let pointApplied = 0;
    let ruleName = '';
    let voucherTerpakai = null;

    // Loop untuk mencari aturan poin yang sesuai
    for (let rule of rules) {
    let isMatch = false;
    const { operator, kondisi_value, point_value, nama_aturan } = rule;

    switch (operator) {
        case '>':
        isMatch = selisihMenit > kondisi_value;
        break;
        case '<':
        isMatch = selisihMenit < kondisi_value;
        break;
        case '=':
        isMatch = selisihMenit === kondisi_value;
        break;
        case '>=':
        isMatch = selisihMenit >= kondisi_value;
        break;
        case '<=':
        isMatch = selisihMenit <= kondisi_value;
        break;
    }

    if (isMatch) {
        pointApplied = point_value;
        ruleName = nama_aturan;
        break;
    }
    }
    // --- LOGIKA PERLINDUNGAN VOUCHER ---
    // Hanya cek voucher jika karyawan terkena PENALTY (pointApplied < 0)
    if (pointApplied < 0 && selisihMenit > 0) {
    const voucherValid = await UserTokenInc.findOne({
        where: {
        user_id: getkaryawan.user_id,
        status: 'AKTIF',
        expired_date: { [Op.gte]: new Date() }, // Pastikan belum expired
        },
        include: [
        {
            model: FlexibilityItemInc,
            as: 'item_detail',
            where: {
            // Voucher harus punya proteksi_menit >= keterlambatan saat ini
            proteksi_menit: { [Op.gte]: selisihMenit },
            },
        },
        ],
        // Ambil yang paling pas (menit terkecil yang masih sanggup melindungi) agar hemat
        order: [
        [
            { model: FlexibilityItemInc, as: 'item_detail' },
            'proteksi_menit',
            'ASC',
        ],
        ],
    });

    if (voucherValid) {
        voucherTerpakai = voucherValid;
        pointApplied = 0; // Batalkan pengurangan poin
        ruleName = `Terlindungi (${voucherValid.item_detail.item_nama})`;
    }
    }

    // 7. Simpan Riwayat & Update Saldo
    if (pointApplied !== 0 || voucherTerpakai) {
    const lastLog = await PointRiwayat.findOne({
        where: { user_id: getkaryawan.user_id },
        order: [['createdAt', 'DESC']],
    });

    let saldoLama = lastLog
        ? lastLog.point_saat_ini
        : getkaryawan.point_karyawan || 0;
    let saldoBaru = saldoLama + pointApplied;

    // Jika voucher digunakan, update statusnya
    if (voucherTerpakai) {
        await voucherTerpakai.update({
        status: 'TELAH DIGUNAKAN',
        used_at_attendance_id: createPresensi.id,
        });
    }

    await PointRiwayat.create({
        user_id: getkaryawan.user_id,
        type_transaksi: voucherTerpakai
        ? 'REWARD'
        : pointApplied > 0
            ? 'REWARD'
            : 'PENALTY',
        jumlah_point: pointApplied,
        point_saat_ini: saldoBaru,
        keterangan: voucherTerpakai
        ? `Menggunakan ${ruleName}`
        : `${ruleName} (${selisihMenit} menit)`,
    });

    await getkaryawan.update({ point_karyawan: saldoBaru });
    }

    // 8. Respon Akhir
    return res.json({
    message: `Presensi Berhasil: ${ruleName}`,
    status: 'berhasil',
    protected: !!voucherTerpakai,
    data: {
        selisih_menit: selisihMenit,
        poin_didapat: pointApplied,
    },
    });
} catch (error) {
    console.error('Error PresensiCheckin:', error);
    return res
    .status(500)
    .json({ message: 'Internal Server Error', error: error.message });
}
};

let PresensiCheckout = async (req, res) => {
let { id_karyawan, token } = req.body;
const now = dayjs();
const today = now.format('YYYY-MM-DD');

try {
    //  Ambil presensi hari ini
    let presensiHariIni = await Presensi.findOne({
    where: {
        karyawan_id: id_karyawan,
        tanggal: today,
    },
    });

    if (!presensiHariIni) {
    return res.status(400).json({
        message: 'Kamu belum melakukan check-in hari ini',
    });
    }

    //  Cek apakah sudah checkout
    if (presensiHariIni.jam_keluar) {
    return res.status(400).json({
        message: 'Kamu sudah melakukan check-out hari ini',
    });
    }

    // 3 Validasi token checkout
    let getToken = await Qr_absensi.findOne({
    where: {
        type: 'keluar',
    },
    });

    if (getToken.token !== token) {
    return res.status(400).json({
        message: 'Token tidak sesuai',
    });
    }

    //  Update jam keluar
    await presensiHariIni.update({
    jam_keluar: now.format('HH:mm:ss'),
    });

    return res.json({
    message: 'Checkout berhasil',
    status: 'berhasil',
    data: presensiHariIni,
    });
} catch (error) {
    return res.status(500).json({
    message: error.message,
    });
}
};

export { PresensiCheckin, PresensiCheckout };
