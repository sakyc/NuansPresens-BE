import karyawanModel from "../../models/karyawan/index.js";
import Qr_absensi from "../../models/qr_absensi/index.js";
import UserModel from "../../models/users/index.js";
import crypto from "crypto";
import { Op } from "sequelize";

let getKaryawan = (req, res) => {
}

let addKaryawan = async (req, res) => {
    let {nama, nip} = req.body
    let defaultPassword = "Karyawan123"

    let createUser = await UserModel.create({
        username: nip,
        password: defaultPassword,
        role: "user"
    })
    let createKaryawan= await karyawanModel.create({
        nama: nama,
        nip: nip,
        shift_id: 1,
        user_id: createUser.id
    })
    
    res.json({
        data: createKaryawan, createUser,
        nama: nama,
        nip: nip
    })
}

export { getKaryawan, addKaryawan };