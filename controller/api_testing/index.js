import dayjs from "dayjs";
import { Karyawan, Shift } from "../../models/index.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(timezone)

let test_selisih = async (req, res) => {
    const now = dayjs().tz("Asia/Jakarta");
    const today = now.format("YYYY-MM-DD");
    let getkaryawan = await Karyawan.findOne({
            where: {
                id: 5
            },
            include: {
                model: Shift
            }
        })

    // jam_shift_mulai biasanya "07:00:00"
    let jam_shift_mulai = getkaryawan.shift.jam_mulai;

    // PENTING: Gabungkan tanggal hari ini dengan jam shift agar perbandingannya apple-to-apple
    const waktuShiftSeharusnya = dayjs(`${today} ${jam_shift_mulai}`);

    // Hitung selisihnya
    const selisihMenit = now.diff(waktuShiftSeharusnya, 'minute');

    res.json({
        selisihMenit: selisihMenit,
        jam_shift_mulai: jam_shift_mulai,
        now: now.format("HH:mm:ss")
    })



}

export {
    test_selisih
}