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

let testPresensi = async (req, res) => {
    let { type, id_karyawan, token } = req.body;
    const now = dayjs().tz("Asia/Jakarta")
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

        if(!check){
            return res.status(400).json({message: "Tidak bisa absen di luar shift"})
        }

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
let getPresensi = async (req, res) => {
  let {
    type, //type masuk apa keluar
    id_karyawan, // dari karyawan
    karyawan_shift, // dari karyawan
    curent_shift, //dari shift
    token, // dari qr
  } = req.body;

  try {
    const getToken = await Qr_absensi.findOne({
      where: {
        type: 1,
      },
    });
    let curent_token = getToken.code;
    console.log(curent_token);
    if (curent_token != token) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Token tidak sesuai',
      });
    }
    if (curent_shift !== karyawan_shift) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Shift tidak sesuai',
      });
    }

    let presensi = await Presensi.create({
      karyawan_id: id_karyawan,
      shift_id: curent_shift,
      tanggal: new Date().toISOString().split('T')[0],
      jam_masuk: new Date().toLocaleTimeString('it-IT'),
      keterlambatan: 'Tepat Waktu',
    });
    return res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Presensi berhasil',
      data: presensi,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: error.message,
    });
  }
};

export { getPresensi, testPresensi };
