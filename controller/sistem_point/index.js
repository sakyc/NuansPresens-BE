import { FlexibilityItemInc, Karyawan, UserTokenInc } from "../../models/index.js";
import karyawan from "../../models/karyawan/index.js";
import PointRiwayat from "../../models/TABLE_POINT/point_riwayat/index.js";
import { Sequelize } from "sequelize";
import dayjs from "dayjs";


let bonusPoint = async (req, res) => {
    let { karyawan_id, jumlah_point, deskripsi} = req.body;
    try {
        let getPointKaryawan = await Karyawan.findOne({
            where: {
                id: karyawan_id
            },
            attributes: ['point_karyawan','user_id'],
            limit: 1
        })
        if (!getPointKaryawan) {
            return res.status(404).json({
                message: "Karyawan tidak ditemukan",
                status: "gagal",
            });
        }
        let totalPoint = getPointKaryawan.point_karyawan + jumlah_point;
        await Karyawan.update({
            point_karyawan: totalPoint
        }, {
            where: {
                id: karyawan_id
            }
        })
        await PointRiwayat.create({
            user_id: getPointKaryawan.user_id,
            jumlah_point: jumlah_point,
            point_saat_ini: totalPoint,
            type_transaksi: "REWARD",
            keterangan: deskripsi
        })
        res.status(200).json({
            message: "Success",
            data: {
                point_before: getPointKaryawan.point_karyawan,
                jumlah_point: jumlah_point,
                point_saat_ini: totalPoint
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: "Terjadi kesalahan pada server" + error.message,
            status: "gagal",
            
        });
    }
}
let getpoint = async (req, res) => {
    let userId = req.query.user_id;
    try {
        let getPointKaryawan = await Karyawan.findOne({
            where: {
                user_id: userId
            },
            attributes: ['point_karyawan', 'nama'],
            limit: 1
        })
        if (!getPointKaryawan) {
            return res.status(404).json({
                message: "Karyawan tidak ditemukan",
                status: "gagal",
            });
        }
        res.status(200).json({
            message: "Success",
            data: getPointKaryawan.point_karyawan,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
            status: "gagal",
            
        });
    }
}

let getRiwayat = async (req, res) => {
    let userId = req.query.user_id;
    try {
        let getPointKaryawan = await Karyawan.findOne({
            where: {
                user_id: userId
            },
            attributes: ['point_karyawan'],
            limit: 1
        })

        let getRiwayatKaryawan = await PointRiwayat.findAll({
            where: {
                user_id: userId
            },
            order: [['createdAt', 'DESC']],
            limit: 10
        })
        res.status(200).json({
            message: "Success",
            point_saat_ini: getPointKaryawan? getPointKaryawan.point_karyawan : 0,
            data: getRiwayatKaryawan
        });

    } catch (error) {
        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
            status: "gagal",
        });
    }

}


let getRanking = async (req, res) => {
    try {
        // Sangat simpel dan cepat
        const ranking = await karyawan.findAll({ 
            attributes: ['id', 'nama', 'point_karyawan'],
            order: [['point_karyawan', 'DESC']], 
            limit: 10 }
        );

        res.status(200).json({
            message: "Success",
            data: ranking
        });
    } catch (error) {
        console.error("DEBUG ERROR RANKING:", error);
        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
}

let redeemPoint = async (req, res) => {
    let { user_id, item_id } = req.body;
    try {
        let pointKaryawan = await Karyawan.findOne({
            where: {
                user_id: user_id
            },
            attributes: ['point_karyawan'],
            limit: 1
        })

        let ItemSlect = await FlexibilityItemInc.findOne({
            where: {
                id: item_id
            }
        })
        if(pointKaryawan.point_karyawan < ItemSlect.item_harga){
            return res.status(400).json({
                message: "Point tidak mencukupi",
                status: "gagal",
                data: {
                    point_saat_ini: pointKaryawan.point_karyawan,
                    harga_item: ItemSlect.item_harga
                }
            });
        }
        await UserTokenInc.create({
            user_id: user_id,
            item_id: item_id,
            status: "AKTIF",
            expired_date: dayjs().add(30, 'day').toDate()
        })
        await PointRiwayat.create({
            user_id: user_id,
            type_transaksi: "SPEND",
            icon: "🎟️",
            point_saat_ini: pointKaryawan.point_karyawan - ItemSlect.item_harga,
            jumlah_point: -ItemSlect.item_harga,
            keterangan: `Pembelian ${ItemSlect.item_nama}`
        })
        await Karyawan.update({
            point_karyawan: pointKaryawan.point_karyawan - ItemSlect.item_harga
        }, {
            where: {
                user_id: user_id
            }
        })
        res.status(200).json({
            message: "Pembelian berhasil",
            status: "success"
        });
    } catch (error) {
        console.error("DEBUG ERROR REDEEM:", error);
        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
}

let getKatalog = async (req, res) => {
    try {
        let tokens = await FlexibilityItemInc.findAll();
        res.status(200).json({
            message: "Success",
            data: tokens
        });
    } catch (error) {
        console.error("DEBUG ERROR KATALOG:", error);
        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
}

let getKaryawanToken = async (req, res) => {
    let userId = req.query.user_id;
    try {
        let tokens = await UserTokenInc.findAll({
            include: [
                {
                    model: FlexibilityItemInc,
                    as: "item_detail" 
                }
            ]
        });
    const now = new Date();

    let dataInventory = tokens.map(item => {
        // 1. Hitung selisih dalam milidetik
        const diffInMs = new Date(item.expired_date) - now;
        
        // 2. Konversi milidetik ke hari (1000ms * 60s * 60m * 24h)
        // Gunakan Math.ceil agar jika sisa 10.5 hari dibulatkan ke atas jadi 11 hari
        const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        return {
            id_item: item.id,
            status: item.status,
            item_nama: item.item_detail?.item_nama,
            diperoleh: item.createdAt,
            expiresIn: daysLeft, 
            item_deskripsi: item.item_detail?.item_deskripsi,
            item_harga: item.item_detail?.item_harga,
            icon: item.item_detail?.icon,
            type_stock: item.item_detail?.type_stock,
            stok_limit: item.stok_limit
            };
        });
        res.status(200).json({
            message: "Success",
            data: dataInventory
        });
    } catch (error) {
        console.error("DEBUG ERROR KATALOG:", error);
        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
}


export {
    getpoint,
    getRiwayat,
    redeemPoint,
    getRanking,
    getKatalog,
    getKaryawanToken,
    bonusPoint
}