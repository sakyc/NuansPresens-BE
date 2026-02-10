import Presensi from "../../../models/presensi/index.js";
import Qr_absensi from "../../../models/qr_absensi/index.js";

let getPresensi = async (req, res) => {
    let {
        id_karyawan, // dari karyawan
        karyawan_shift, // dari karyawan
        curent_shift, //dari shift
        token, // dari qr
    } = req.body;

    try {
        const getToken = await Qr_absensi.findOne({
            where: {
                type: 1
            }
        })
        let curent_token = getToken.code
        console.log(curent_token);
        if(curent_token != token){
            return res.status(400).json({
                status: "error",
                code: 400,
                message: "Token tidak sesuai",
            })
        }
        if(curent_shift !== karyawan_shift){
            return res.status(400).json({
                status: "error",
                code: 400,
                message: "Shift tidak sesuai"
            })
        }

        let presensi = await Presensi.create({
            karyawan_id: id_karyawan,
            shift_id: curent_shift,
            tanggal: new Date().toISOString().split('T')[0],
            jam_masuk: new Date().toLocaleTimeString('it-IT'),
            keterlambatan: "Tepat Waktu"
        })
        return res.status(200).json({
            status: "success",
            code: 200,
            message: "Presensi berhasil",
            data: presensi

        })
        
    } catch (error) {
        return res.status(500).json({
            status: "error",
            code: 500,
            message: error.message
        })
    }
    
    
}

export { getPresensi }