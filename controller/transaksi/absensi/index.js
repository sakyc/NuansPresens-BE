import Absensi from "../../../models/absensi/index.js";
import Karyawan from "../../../models/karyawan/index.js";
import { Op } from "sequelize";
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

let PengajuanAbsensi = async (req, res) => {
    let { 
        karyawan_id, 
        kategory_absensi_id, 
        shift_id,
        tanggal_mulai, 
        tanggal_selesai,
        keterangan, 
        foto 
    } = req.body;

    try {
        // validasi data ada semua
        if (!karyawan_id) {
            return res.status(400).json({
                message: "ID karyawan harus diisi",
                status: "gagal"
            });
        }

        if (!kategory_absensi_id) {
            return res.status(400).json({
                message: "Kategori absensi harus dipilih",
                status: "gagal"
            });
        }

        if (!tanggal_mulai) {
            return res.status(400).json({
                message: "Tanggal mulai harus diisi",
                status: "gagal"
            });
        }

        if (!keterangan || !keterangan.trim()) {
            return res.status(400).json({
                message: "Keterangan harus diisi",
                status: "gagal"
            });
        }

        
        const tglMulai = dayjs(tanggal_mulai);
        const tglSelesai = tanggal_selesai ? dayjs(tanggal_selesai) : tglMulai;

        // Jika tidak ada tanggal selesai, set sama dengan tanggal mulai
        if (!tanggal_selesai) {
            tanggal_selesai = tanggal_mulai;
        }

        // Cek tanggal selesai >= tanggal mulai
        if (tglSelesai.isBefore(tglMulai)) {
            return res.status(400).json({
                message: "Tanggal selesai harus setelah atau sama dengan tanggal mulai",
                status: "gagal"
            });
        }

        
        // Cek karyawan ada
        
        const karyawan = await Karyawan.findByPk(karyawan_id);
        if (!karyawan) {
            return res.status(404).json({
                message: "Karyawan tidak ditemukan",
                status: "gagal"
            });
        }

        
        //  Cek bentrok dengan pengajuan lain
        
         // Cek apakah sudah ada pengajuan di rentang tanggal yang sama
        const cekBentrok = await Absensi.findOne({
            where: {
                karyawan_id: karyawan_id,
                status: ['pending', 'disetujui'], 
                [Op.or]: [
                    {
                        // Kasus: pengajuan baru di dalam rentang yang sudah ada
                        tanggal_mulai: { [Op.lte]: tanggal_selesai },
                        tanggal_selesai: { [Op.gte]: tanggal_mulai }
                    }
                ]
            }
        });

        if (cekBentrok) {
            return res.status(400).json({
                message: `Anda sudah memiliki pengajuan di rentang ${cekBentrok.tanggal_mulai} - ${cekBentrok.tanggal_selesai}`
            });
        }

    
        
        // SIMPAN PENGAJUAN
        
        let data = await Absensi.create({
            karyawan_id: karyawan_id,
            kategori_absensi_id: kategory_absensi_id,
            shift_id: shift_id,
            tanggal_mulai: tanggal_mulai,
            tanggal_selesai: tanggal_selesai,
            keterangan: keterangan,
            foto: foto,
            status: "pending"
        });

        // Format response sukses
        return res.status(201).json({
            message: "Pengajuan berhasil dikirim",
            status: "berhasil",
            data: {
                id: data.id,
                karyawan_id: data.karyawan_id,
                kategori_absensi_id: data.kategori_absensi_id,
                tanggal_mulai: data.tanggal_mulai,
                tanggal_selesai: data.tanggal_selesai,
                keterangan: data.keterangan,
                status: data.status,
                created_at: data.createdAt
            }
        });

    } catch (error) {
        
        
        // Error database constraint
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
                message: "Data pengajuan sudah ada",
                status: "gagal",
                error: error.errors?.map(e => e.message)
            });
        }

        // Error validasi database
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                message: "Data tidak valid",
                status: "gagal",
                error: error.errors?.map(e => e.message)
            });
        }

        // Error foreign key constraint
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({
                message: "Data referensi tidak ditemukan (karyawan/kategori/shift tidak valid)",
                status: "gagal"
            });
        }

        
        console.error("PengajuanAbsensi Error:", error);
        
        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
            status: "gagal",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export {
    PengajuanAbsensi
};