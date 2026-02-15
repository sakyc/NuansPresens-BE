import karyawanModel from "../../models/karyawan/index.js";
import UserModel from "../../models/users/index.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

let getKaryawan = (req, res) => {
}

let addKaryawan = async (req, res) => {
    let {nama, nip, jabatan_id, divisi_id, shift_id, email, no_hp, foto, gender} = req.body
    let generatePassword = crypto.randomBytes(10).toString('hex');
    let hashPassword = await bcrypt.hash(generatePassword, 10);

    try {
        let createUser = await UserModel.create({
            username: nip,
            password: hashPassword,
            role: "karyawan"
        })
        
        let createKaryawan= await karyawanModel.create({
            jabatan_id: jabatan_id,
            divisi_id: divisi_id,
            shift_id: shift_id,
            nama: nama,
            nip: nip,
            email: email,
            no_hp: no_hp,
            foto: foto,
            gender: gender,
            user_id: createUser.id
        })
        
        res.json({
            data: createKaryawan, createUser,
            password: generatePassword,
            nama: nama,
            nip: nip
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
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

export { getKaryawan, addKaryawan, chectPassword };