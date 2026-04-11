import db from "../../../config/db.js";
import { detailPenilaian, penilaian } from "../../../models/index.js";

const simpanDetailPenilaian = async (req, res) => {
  const { penilaian_id, catatan, detail, userId } = req.body;

  // Mulai Transaksi
  const t = await db.transaction();

  try {
    // 1. Update tabel Penilaian (Header)
    // Mengisi catatan dan otomatis dianggap selesai (karena sudah dinilai)
    await penilaian.update(
      { catatan: catatan, atasan_id: userId },
      { where: { id: penilaian_id }, transaction: t }
    );

    // 2. Hapus detail lama jika ada (antisipasi jika user melakukan edit/ubah nilai)
    await detailPenilaian.destroy({
      where: { penilaian_id: penilaian_id },
      transaction: t
    });

    // 3. Simpan data detail baru (Bulk Create)
    const detailData = detail.map((d) => ({
      penilaian_id: penilaian_id,
      kategori_penilaian_id: d.kategori_id,
      poin: d.nilai,
    }));

    await detailPenilaian.bulkCreate(detailData, { transaction: t });

    // Jika semua oke, commit transaksi
    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Penilaian berhasil disimpan!",
    });

  } catch (error) {
    // Jika ada yang gagal, batalkan semua perubahan
    await t.rollback();
    console.error("Error Simpan Penilaian:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menyimpan penilaian",
      error: error.message,
    });
  }
};

export {
    simpanDetailPenilaian
}