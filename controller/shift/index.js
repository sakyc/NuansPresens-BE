import shift from "../../models/shift/index.js";

let seederShift = async (req, res) => {
    await shift.bulkCreate([
        {
            nama: "Shift 1",
            jam_mulai: "07:00:00",
            jam_selesai: "15:00:00"
        },
        {
            nama: "Shift 2",
            jam_mulai: "15:00:00",
            jam_selesai: "23:00:00"
        }
    ]);
    res.json({ message: "Seeder shift berhasil dijalankan" });
}

export {
    seederShift
}