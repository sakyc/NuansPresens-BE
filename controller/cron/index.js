import cron from 'node-cron';
import { Op } from 'sequelize';
import db from '../../config/db.js';
import { Karyawan, UserTokenInc } from '../../models/index.js';
import PointRiwayat from '../../models/TABLE_POINT/point_riwayat/index.js';
import PointRule from '../../models/TABLE_POINT/point_rules/index.js';
import Presensi from '../../models/presensi/index.js';



//  Update Voucher Expired 
cron.schedule('* * * * *', async () => {
    console.log('--- Menjalankan Cron: Update Voucher Expired ---');
    try {
        await UserTokenInc.update(
            { status: 'EXPIRED' },
            { 
                where: { 
                    status: 'AKTIF',
                    expired_date: { [Op.lt]: new Date() } 
                } 
            }
        );
        console.log('Berhasil update voucher expired.');
    } catch (error) {
        console.error('Gagal update voucher:', error);
    }
});

cron.schedule('15 09 * * *', async () => {
    console.log('--- Menjalankan Cron: Cek Alfa ---');
    
    // 1. Cek Hari (Lewati jika Sabtu(6) atau Minggu(0))
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        console.log('Hari libur akhir pekan, cron dibatalkan.');
        return;
    }

    const t = await db.transaction();
    const today = new Date().toISOString().split('T')[0];

    try {
        // 2. Ambil Aturan Pinalti Alfa
        const alfaRule = await PointRule.findOne({
            where: { operator: 'ALFA' }, 
            transaction: t
        });

        if (!alfaRule) {
            console.error('Aturan ALFA tidak ditemukan di database!');
            await t.rollback();
            return;
        }

        const pinaltiAlfa = alfaRule.point_value; // Contoh: -50
        const namaAturan = alfaRule.nama_aturan;

        // 3. Ambil Semua Karyawan
        const daftarKaryawan = await Karyawan.findAll({ transaction: t });

        for (let karyawan of daftarKaryawan) {
            // A. Cek apakah sudah absen masuk hari ini
            const sudahPresensi = await Presensi.findOne({
                where: { 
                    karyawan_id: karyawan.id, 
                    tanggal: today 
                },
                transaction: t
            });

            // B. Jika BELUM presensi, cek apakah dia punya Izin/Sakit/Cuti yang APPROVED
            if (!sudahPresensi) {
                const sedangIzin = await Absensi.findOne({
                    where: {
                        karyawan_id: karyawan.id,
                        status: 'approved',
                        tanggal_mulai: { [Op.lte]: today }, // Mulai <= hari ini
                        tanggal_selesai: { [Op.gte]: today } // Selesai >= hari ini
                    },
                    transaction: t
                });

                // C. Jika tidak ada data Presensi DAN tidak ada data Absensi, maka ALFA
                if (!sedangIzin) {
                    const saldoBaru = karyawan.point_karyawan + pinaltiAlfa;

                    // Update Poin Karyawan
                    await karyawan.update(
                        { point_karyawan: saldoBaru }, 
                        { transaction: t }
                    );

                    // Catat di Riwayat Poin
                    await PointRiwayat.create({
                        user_id: karyawan.user_id,
                        type_transaksi: 'PENALTY',
                        jumlah_point: pinaltiAlfa,
                        point_saat_ini: saldoBaru,
                        keterangan: `${namaAturan} (${today})`
                    }, { transaction: t });

                    console.log(`[ALFA] ${karyawan.nama}: Poin dipotong ${pinaltiAlfa}`);
                } else {
                    console.log(`[IZIN] ${karyawan.nama}: Tidak hadir karena ${sedangIzin.keterangan}`);
                }
            } else {
                console.log(`[HADIR] ${karyawan.nama}: Sudah absen.`);
            }
        }

        await t.commit();
        console.log('--- Cron Selesai: Semua data berhasil diproses ---');

    } catch (error) {
        if (t) await t.rollback();
        console.error('Gagal menjalankan pinalti alfa:', error);
    }
});