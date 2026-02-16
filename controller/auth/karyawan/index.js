import bcrypt from "bcryptjs";
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
        const IdUser = getUser.id
        const getkaryawan = await User.findOne({
            where: {
                id: IdUser
            },
            include: {
                model: Karyawan,
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
            data: getkaryawan 
        })
    
    } catch (error) {
        res.json({
            massage: error
        })
    }
}

export {login}