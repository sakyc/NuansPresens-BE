import kategoryPenilaian from "../../models/TABLE_PENILAIAN/kategori_penilaian/index.js";

const seedKategoriPenilaian = async () => {
  try {
    const data = [
      {
        nama_kategori: "Kedisiplinan",
        deskripsi: "Kepatuhan terhadap jam kerja dan peraturan perusahaan.",
        status: "aktif",
      },
      {
        nama_kategori: "Kerja Sama Tim",
        deskripsi: "Kemampuan berinteraksi dan membantu rekan kerja dalam proyek.",
        status: "aktif",
      },
      {
        nama_kategori: "Inisiatif",
        deskripsi: "Kemauan untuk mengambil tindakan tanpa harus menunggu instruksi.",
        status: "aktif",
      },
      {
        nama_kategori: "Kualitas Kerja",
        deskripsi: "Ketelitian dan kerapihan dalam menyelesaikan tugas yang diberikan.",
        status: "aktif",
      },
      {
        nama_kategori: "Loyalitas",
        deskripsi: "Kesetiaan dan dedikasi terhadap visi misi perusahaan.",
        status: "aktif",
      },
    ];

    // Memasukkan data baru
    await kategoryPenilaian.bulkCreate(data);

    console.log(" Seeder Kategori Penilaian berhasil dijalankan!");
  } catch (error) {
    console.error(" Gagal menjalankan seeder:", error);
  }
};

export default seedKategoriPenilaian;