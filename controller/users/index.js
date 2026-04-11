import bcrypt from "bcryptjs"
import { User } from "../../models/index.js"

let createUsers = async (req, res) => {
    let {username, password} = req.body
    let haspw = await bcrypt.hash(password, 10)
    try {
        let createUser = User.create({
            username: username, 
            password: haspw,
            role: "admin"
        })
        res.json({data: createUser})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export {
    createUsers
}