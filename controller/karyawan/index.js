import { Karyawan as karyawanModel, User as UserModel, Jabatan as JabatanModel, Divisi as DivisiModel, Shift as ShiftModel } from "../../models/index.js";
import bcrypt from "bcryptjs";

let addKaryawan = async (req, res) => {
    let {nama, nip, jabatan_id, divisi_id, shift_id, email, no_hp, foto, gender, alamat, atasan_id} = req.body

    try {
        // validasi atasan
        if (atasan_id) {
            // Cari data user berdasarkan karyawan_id yang dijadikan atasan
            // cek  rolenya di table user
            const calonAtasan = await karyawanModel.findOne({
                where: { id: atasan_id },
                include: [{
                    model: UserModel,
                    as: "user"
                }]
            });

            // Jika atasan tidak ditemukan atau rolenya bukan manager
            if (!calonAtasan || calonAtasan.user.role !== 'manager') {
                return res.status(400).json({
                    message: "Gagal: Atasan haruslah seorang dengan role Manager!"
                });
            }
        }

        let generatePassword = "Karyawan123";
        let hashPassword = await bcrypt.hash(generatePassword, 10);

        let createUser = await UserModel.create({
            username: nip,
            password: hashPassword,
            role: "karyawan"
        });
        
        let createKaryawan = await karyawanModel.create({
            jabatan_id,
            divisi_id,
            shift_id,
            atasan_id: atasan_id || null, 
            nama,
            nip,
            email,
            no_hp,
            foto,
            gender,
            status: "aktif",
            alamat,
            user_id: createUser.id
        });
        
        res.json({
            message: "Berhasil menambahkan karyawan",
            data: createKaryawan,
            password: generatePassword
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
let chectPassword = async (req, res) => {
    try {
        let getusers = await UserModel.findOne({
            where: {id:5}
        })
        let checkPassword = await bcrypt.compare('12006675d147998faf8', getusers.password);
        res.json({
            data: getusers,
            isPasswordValid: checkPassword
        })
        
    } catch (error) {
        
    }
}

let getKaryawan = async (req, res) => {
    try {
        const data = await karyawanModel.findAll({
            include: [
                { model: UserModel, as: "user", attributes: ['id', 'username', 'role'] },
                { model: JabatanModel },
                { model: DivisiModel },
                { model: ShiftModel }
            ]
        });
        res.json({ message: "Berhasil mengambil data karyawan", data });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

let getKaryawanById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await karyawanModel.findOne({
            where: { id },
            include: [
                { model: UserModel, as: "user", attributes: ['id', 'username', 'role'] },
                { model: JabatanModel },
                { model: DivisiModel },
                { model: ShiftModel }
            ]
        });
        if (!data) return res.status(404).json({ message: "Karyawan tidak ditemukan" });
        res.json({ message: "Berhasil mengambil data karyawan", data });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

let updateKaryawan = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, nip, jabatan_id, divisi_id, shift_id, email, no_hp, foto, gender, alamat, atasan_id, status } = req.body;
        const karyawan = await karyawanModel.findByPk(id);
        if (!karyawan) return res.status(404).json({ message: "Karyawan tidak ditemukan" });
        
        await karyawan.update({
            nama, nip, jabatan_id, divisi_id, shift_id, email, no_hp, foto: foto || karyawan.foto, gender, alamat, atasan_id: atasan_id || null, status: status || karyawan.status
        });
        
        res.json({ message: "Berhasil mengubah karyawan", data: karyawan });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

let deleteKaryawan = async (req, res) => {
    try {
        const { id } = req.params;
        const karyawan = await karyawanModel.findByPk(id);
        if (!karyawan) return res.status(404).json({ message: "Karyawan tidak ditemukan" });
        
        const userId = karyawan.user_id;
        await karyawan.destroy();
        
        if (userId) {
            await UserModel.destroy({ where: { id: userId } });
        }
        
        res.json({ message: "Berhasil menghapus karyawan", data: karyawan });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { addKaryawan, chectPassword, getKaryawan, getKaryawanById, updateKaryawan, deleteKaryawan };
