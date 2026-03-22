import { Karyawan as karyawanModel, User as UserModel } from "../../models/index.js";
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

export { addKaryawan, chectPassword };