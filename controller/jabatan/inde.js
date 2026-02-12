import jabatanModel from "../../models/jabatan/index.js";

let seederJabatan = async (req, res) => {
    let data = [
        {
            nama_jabatan: "Admin"
        },
        {
            nama_jabatan: "Karyawan"
        }
    ];
    await jabatanModel.bulkCreate(data);
    res.json({ message: "Seeder jabatan berhasil dijalankan" });
};

export { seederJabatan };