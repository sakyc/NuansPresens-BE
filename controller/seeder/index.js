import Jabatan from "../../models/jabatan"

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

        let createCategoryAbsen = await absen



        res.json({
            message: "Semua Seeder telah di jalankan",
            data: {
                jabatan: createJabatan,
                shift: createShift,
                divisi: createDivisi
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}