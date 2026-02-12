import Jabatan from "../../models/jabatan/index.js"
import Shift from "../../models/shift/index.js"
import Divisi from "../../models/divisi/index.js"
import CategoryAbsen from "../../models/kategory_absensi/index.js"

let Seeder = async (req, res) => {
    try {
        let createJabatan = await Jabatan.bulkCreate([
            { nama_jabatan: "Manager" },
            { nama_jabatan: "Supervisor" },
            { nama_jabatan: "Staff" },
            { nama_jabatan: "Intern" }
        ])

        let createShift = await Shift.bulkCreate([
            { nama: "Shift 1", jam_mulai: "07:00:00", jam_selesai: "15:00:00" },
            { nama: "Shift 2", jam_mulai: "15:00:00", jam_selesai: "23:00:00" }
        ])

        let createDivisi = await Divisi.bulkCreate([
            { nama_divisi: "UI/UX Designer" },
            { nama_divisi: "Frontend Engineer" },
            { nama_divisi: "Backend Engineer" },
            { nama_divisi: "DevOps Engineer" }
        ])

        let createCategoryAbsen = await CategoryAbsen.bulkCreate([
            { nama_kategory: "izin" },
            { nama_kategory: "sakit" },
            { nama_kategory: "cuti" },
        ])

        

        res.json({
            message: "Semua Seeder telah di jalankan",
            data: {
                jabatan: createJabatan,
                shift: createShift,
                divisi: createDivisi,
                createCategoryAbsen
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export default Seeder