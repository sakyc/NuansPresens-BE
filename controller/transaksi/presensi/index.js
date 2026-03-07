import Presensi from '../../../models/presensi/index.js';
import Qr_absensi from '../../../models/qr_absensi/index.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"
import { Jabatan, Karyawan, Shift } from '../../../models/index.js'; 
import { Model } from 'sequelize';

dayjs.extend(isBetween);
dayjs.extend(utc)
dayjs.extend(timezone)

let PresensiCheckin = async (req, res) => {
    let { type, id_karyawan, token } = req.body;
    const now = dayjs()
    const today = now.format("YYYY-MM-DD")
    try {
        let getToken = await Qr_absensi.findOne({
            where: {
                type: type
            }
        })
        let getkaryawan = await Karyawan.findOne({
            where: {
                id: id_karyawan
            },
            include: {
                model: Shift
            }
        })

        let shift_masuk = getkaryawan.shift.jam_mulai
        let shift_selesai = getkaryawan.shift.jam_selesai

        let jam_shift_mulai = dayjs.tz(`${today} ${shift_masuk}`, "Asia/Jakarta")
        let jam_shift_selesai = dayjs.tz(`${today} ${shift_selesai}`,)

        let check = now.isBetween(jam_shift_mulai, jam_shift_selesai)

        
        let curent_token = getToken.token
        let token_karyawwan = token
        
        if(curent_token !== token_karyawwan){
            return res.status(400).json(
                {
                    message: "Token tidak sesuai",
                    status: "gagal",
                    data: {
                        curent_token: curent_token,
                        token_karyawwan: token_karyawwan
                    }
                    
                })
            }
            
        if(!check){
            return res.status(400).json({message: "Tidak bisa absen di luar shift"})
        }

        let createPresensi = await Presensi.create({
            karyawan_id: id_karyawan,
            shift_id: getkaryawan.shift_id,
            tanggal: today,
            jam_masuk: now.format("HH:mm:ss"),
        })
        res.json({
            message: "success",
            status: "berhasil",
            check: check,
            data: createPresensi
            
            
        })
        
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
            message: "Kamu sudah absen hari ini"
        })
    }
        res.status(500).json({ message: error.message });
    }
};

let PresensiCheckout = async (req, res) => {
    let { id_karyawan, token } = req.body;
    const now = dayjs()
    const today = now.format("YYYY-MM-DD")

    try {

        //  Ambil presensi hari ini
        let presensiHariIni = await Presensi.findOne({
            where: {
                karyawan_id: id_karyawan,
                tanggal: today
            }
        });

        if (!presensiHariIni) {
            return res.status(400).json({
                message: "Kamu belum melakukan check-in hari ini"
            });
        }

        //  Cek apakah sudah checkout
        if (presensiHariIni.jam_keluar) {
            return res.status(400).json({
                message: "Kamu sudah melakukan check-out hari ini"
            });
        }

        // 3 Validasi token checkout
        let getToken = await Qr_absensi.findOne({
            where: {
                type: "keluar"
            }
        });

        if (getToken.token !== token) {
            return res.status(400).json({
                message: "Token tidak sesuai"
            });
        }

        //  Update jam keluar
        await presensiHariIni.update({
            jam_keluar: now.format("HH:mm:ss")
        });

        return res.json({
            message: "Checkout berhasil",
            status: "berhasil",
            data: presensiHariIni
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export { PresensiCheckin, PresensiCheckout };
