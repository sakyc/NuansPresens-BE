import db from "../../../config/db.js";
import { Op, Sequelize } from "sequelize";
import { detailPenilaian, Karyawan, penilaian, priodePenilaian, User, Divisi, Jabatan } from "../../../models/index.js";


const generatePeriode = async (req, res) => {
  const { priode, tahun, bulan, id_admin } = req.body;

  try {
    // Cek apakah periode (bulan & tahun) sudah pernah dibuat
    const existingPeriode = await priodePenilaian.findOne({
      where: {
        bulan: bulan,
        tahun: tahun
      }
    });

    if (existingPeriode) {
      return res.status(400).json({ 
        message: `Periode untuk bulan, ${bulan} tahun ${tahun} sudah ada. Tidak bisa generate ulang!` 
      });
    }

    // 2. Jika belum ada, baru jalankan Transaction
    const t = await db.transaction();

    try {
      // 3. Buat record periode baru
      const newPeriode = await priodePenilaian.create({
        nama_priode: priode,
        tahun: tahun,
        bulan: bulan,
        tanggal: new Date(),
        status: 'aktif',
        created_by: id_admin 
      }, { transaction: t });

      // 4. Ambil semua karyawan (Gunakan transaction agar konsisten)
      const karyawanAktif = await Karyawan.findAll({ 
        where: { status: 'aktif' },
        transaction: t 
      });

      if (karyawanAktif.length === 0) {
        throw new Error("Tidak ada karyawan aktif untuk dinilai.");
      }

      // 5. Siapkan data antrean
      const dataAntrean = karyawanAktif.map(k => ({
        karyawan_id: k.id,
        priode: newPeriode.id, 
        atasan_id: null,
        tanggal: new Date(),
        catatan: "" 
      })); 

      // 6. Bulk Insert
      await penilaian.bulkCreate(dataAntrean, { transaction: t });

      // 7. COMMIT!
      await t.commit();

      res.status(201).json({
        message: `Berhasil generate periode ${priode}`,
        totalKaryawan: karyawanAktif.length
      });

    } catch (innerError) {
      // Rollback jika proses di dalam transaksi gagal
      await t.rollback();
      throw innerError; // Lemparkan ke catch utama
    }

  } catch (error) {
    console.error("Error Generate:", error);
    res.status(500).json({ message: error.message });
  }
};

let getAllPeriode = async (req, res) => {
  const { userId } = req.params; 

  try {
    // 1. Cek Role User
    const userAktif = await User.findByPk(userId, {
      include: [{ model: Karyawan, as: "karyawan" }]
    });

    if (!userAktif) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    // 2. Buat filter dinamis untuk include Penilaian
    let filterPenilaian = {};
    if (userAktif.role === "manager") {
      // Hanya menghitung penilaian dimana karyawan_id memiliki atasan_id = manager tersebut
      // Dan tidak menghitung dirinya sendiri
      filterPenilaian = {
        "$list_penilaian.atasan_id$": userAktif.karyawan.id,
        "karyawan_id": { [Op.ne]: userAktif.karyawan.id }
      };
    }

    // 3. Eksekusi Query
    const allPeriode = await priodePenilaian.findAll({
      attributes: [
        'id', 'nama_priode', 'tahun', 'bulan', 'tanggal', 'status', 'createdAt',
        [
          Sequelize.literal("COUNT(DISTINCT `list_penilaian`.`id`)"), 
          "total_karyawan"
        ],
        [
          Sequelize.literal("COUNT(DISTINCT CASE WHEN `list_penilaian->rincian_poin`.`id` IS NOT NULL THEN `list_penilaian`.`id` END)"), 
          "total_terverifikasi"
        ]
      ],
      include: [
        {
          model: penilaian,
          as: 'list_penilaian',
          attributes: [],
          where: filterPenilaian, // Filter diterapkan di sini
          required: false, // Penting! Agar periode tetap muncul meskipun belum ada penilaian
          include: [
            {
              model: detailPenilaian,
              as: 'rincian_poin',
              attributes: []
            }
          ]
        }
      ],
      group: ['priode_penilaian.id'], 
      subQuery: false,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ 
      success: true,
      role_access: userAktif.role,
      data: allPeriode
    });

  } catch (error) {
    console.error("Error Get All Periode:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

let updatePeriode = async (req, res) => {
  let { id } = req.body;
  let status = "selesai"
  try {
    let updatePeriode = await priodePenilaian.update({ status }, { where: { id } });
    res.json({ data: updatePeriode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

let getPeriodeByRole = async (req, res) => {
  const { periodeId, userId } = req.body;

  try {
    if (!periodeId) {
      return res.status(400).json({ success: false, message: "Periode tidak ditemukan" });
    }
    if (!userId) {
      return res.status(400).json({ success: false, message: "User tidak ditemukan" });
    }
    // 1. Cari tahu siapa yang mengakses (Manager atau Admin?)
    const userAktif = await User.findByPk(userId, {
      include: [{ model: Karyawan, as: "karyawan" }] // Pakai alias k kecil sesuai relasi kamu
    });

    if (!userAktif) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }
    // res.json(userAktif)
    // 2. Tentukan Filter Penilaian berdasarkan Role
    let filter = { priode: periodeId }; // Filter dasar: Periode yang dipilih

    if (userAktif.role === "manager") {
      // Jika Manager, tambahkan syarat: hanya karyawan yang atasannya dia
      // Kita gunakan '$...$' untuk memfilter berdasarkan kolom di tabel yang di-include
      filter["$data_karyawan.atasan_id$"] = userAktif.karyawan.id;
      filter["karyawan_id"] = { [Op.ne]: userAktif.karyawan.id }; //tidak bisa meniali dirinya sendiri
    } 
    // Jika role === "Admin", filter tidak ditambah (menampilkan semua divisi)

    // 3. Eksekusi Pencarian Data
    const daftarPenilaian = await penilaian.findAll({
      where: filter,
      include: [
        {
          model: Karyawan,
          as: "data_karyawan", // Sesuai alias di file relasi kamu
          include: [
            { model: Divisi },
            { model: Jabatan }
          ]
        }
      ]
    });

    // 4. Kirim Respon
    res.json({
      success: true,
      role: userAktif.role,
      count: daftarPenilaian.length,
      data: daftarPenilaian
    });

  } catch (error) {
    console.error("Error getPeriodeByRole:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  generatePeriode,
  getAllPeriode,
  updatePeriode,
  getPeriodeByRole
}