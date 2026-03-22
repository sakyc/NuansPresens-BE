import { kategoryPenilaian } from "../../../models/index.js";

let getKategori_penilaian = async (req, res) => {
    try {
        let getKategory = await kategoryPenilaian.findAll();
        res.status(200).json({ data: getKategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {
    getKategori_penilaian
}