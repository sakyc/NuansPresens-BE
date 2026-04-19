import Absensi from "../../models/absensi/index.js";
import { Karyawan } from "../../models/index.js";
let GetPengajuan = async (req, res) => {
    try {
        let getAbsensi = await Absensi.findAll({
            include:[
                {model: Karyawan}
            ]
        })

        res.status(200).json({
            data: getAbsensi
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export { GetPengajuan }