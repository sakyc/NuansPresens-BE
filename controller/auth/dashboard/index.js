import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Karyawan, User, Divisi, Shift, Jabatan } from "../../../models/index.js";

const login = async (req, res) => {
    const {username, password} = req.body

    try {
        const getUser =  await User.findOne({
            where: {
                username: username
            },
        })
        if(!getUser){
            return res.status(404).json({
                massage: "Username tidak ditemukan"
            })
        }
        
        let validate = await bcrypt.compare(password, getUser.password);
        
        if(!validate){
            return res.status(404).json({
                massage: "Password salah" + getUser.id
            })
        }

        let tokenJWT = jwt.sign({
            id: getUser.id
        }, "nuansua", {
            expiresIn: "1d"
        })

        const IdUser = getUser.id
        const getkaryawan = await User.findOne({
            where: {
                id: IdUser
            },
            include: {
                model: Karyawan,
                as: "karyawan",
                include:[
                    {model: Divisi},
                    {model: Shift},
                    {model: Jabatan}
                ]
            }
        })
        if(!getkaryawan){
            return res.status(404).json({
                massage: "Password salah" 
            })
        }
        res.status(200).json({
            massage: "success",
            data: getkaryawan,
            token: tokenJWT
        })
    
    } catch (error) {
        res.json({
            massage: error
        })
    }
}

export {login}