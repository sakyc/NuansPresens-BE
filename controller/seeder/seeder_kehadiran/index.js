import Absensi from "../../../models/absensi"
import Presensi from "../../../models/presensi"

let seeder_presensi = async (req, res) => {
    let presensi_seeder = await Presensi.bulkCreate([
        {
            karyawan_id: 1,
            shift_id: 1,
            tanggal: "2026-2-1",
            jam_masuk: "08:00:00",
            jam_keluar: "17:00:00",
            status_kehadiran: "tepat waktu" // atau terlambat
        }
    ])

    let absen_seeder = await Absensi.bulkCreate([
        {
            karyawan_id: 1,
            kategory_absensi_id: 1,
        }
    ])
}