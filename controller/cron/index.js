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

cron.schedule('55 06 * * *', async () => {
    console.log('--- Menjalankan Cron: Cek Alfa ---');
    const t = await db.transaction();
    const today = new Date().toISOString().split('T')[0];

    try {
        // 1. Ambil aturan ALFA dari database secara dinamis
        const alfaRule = await PointRule.findOne({
            where: { operator: 'ALFA' }, // Mencari rule dengan operator 'ALFA'
            transaction: t
        });

        // Jika aturan tidak ditemukan di DB, gunakan default -50
        const pinaltiAlfa = alfaRule.point_value ;
        const namaAturan = alfaRule.nama_aturan ;

        const daftarKaryawan = await Karyawan.findAll({ transaction: t });

        for (let karyawan of daftarKaryawan) {
            const absenHariIni = await Presensi.findOne({
                where: { karyawan_id: karyawan.id, tanggal: today },
                transaction: t
            });

            if (!absenHariIni) {
                const saldoBaru = karyawan.point_karyawan  + pinaltiAlfa;

                await karyawan.update({ point_karyawan: saldoBaru }, { transaction: t });

                await PointRiwayat.create({
                    user_id: karyawan.user_id,
                    type_transaksi: 'PENALTY',
                    jumlah_point: pinaltiAlfa,
                    point_saat_ini: saldoBaru,
                    keterangan: `${namaAturan} (${today})`
                }, { transaction: t });
            }
        }
        await t.commit();
    } catch (error) {
        await t.rollback();
        console.error('Gagal pinalti alfa:', error);
    }
});