import { Jabatan as JabatanModel } from "../../models/index.js";

export const getJabatan = async (req, res) => {
    try {
        const data = await JabatanModel.findAll();
        res.json({ message: "Berhasil mengambil data jabatan", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getJabatanById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await JabatanModel.findByPk(id);
        if (!data) return res.status(404).json({ message: "Jabatan tidak ditemukan" });
        res.json({ message: "Berhasil mengambil data jabatan", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createJabatan = async (req, res) => {
    try {
        const { nama_jabatan } = req.body;
        const data = await JabatanModel.create({ nama_jabatan });
        res.json({ message: "Berhasil menambahkan jabatan", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateJabatan = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_jabatan } = req.body;
        const data = await JabatanModel.findByPk(id);
        if (!data) return res.status(404).json({ message: "Jabatan tidak ditemukan" });
        await data.update({ nama_jabatan });
        res.json({ message: "Berhasil mengubah jabatan", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteJabatan = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await JabatanModel.findByPk(id);
        if (!data) return res.status(404).json({ message: "Jabatan tidak ditemukan" });
        await data.destroy();
        res.json({ message: "Berhasil menghapus jabatan", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
