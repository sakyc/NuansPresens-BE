import User from "./users/index.js"
import Karyawan from "./karyawan/index.js"
import Shift from "./shift/index.js"
import Jabatan from "./jabatan/index.js"
import Divisi from "./divisi/index.js"
import Absensi from "./absensi/index.js"
// Import Model Penilaian
import priodePenilaian from "./TABLE_PENILAIAN/periode_penilaian/index.js";
import penilaian from "./TABLE_PENILAIAN/penilaian/index.js";
import detailPenilaian from "./TABLE_PENILAIAN/detail_penilaian/index.js";
import kategoryPenilaian from "./TABLE_PENILAIAN/kategori_penilaian/index.js";
import UserTokenInc from "./TABLE_POINT/user_token/index.js"
import FlexibilityItemInc from "./TABLE_POINT/point_katalog_item/index.js"
import UserToken from "./TABLE_POINT/user_token/index.js"
import FlexibilityItem from "./TABLE_POINT/point_katalog_item/index.js"

// --- RELASI MASTER KARYAWAN ---
User.hasOne(Karyawan, { foreignKey: "user_id", as: "karyawan" });
Karyawan.belongsTo(User, { foreignKey: "user_id", as: "user" });

Shift.hasMany(Karyawan, { foreignKey: "shift_id" });
Karyawan.belongsTo(Shift, { foreignKey: "shift_id" });

Jabatan.hasMany(Karyawan, { foreignKey: "jabatan_id" });
Karyawan.belongsTo(Jabatan, { foreignKey: "jabatan_id" });

Divisi.hasMany(Karyawan, { foreignKey: "divisi_id" });
Karyawan.belongsTo(Divisi, { foreignKey: "divisi_id" });

Karyawan.hasMany(Absensi, { foreignKey: "karyawan_id" });
Absensi.belongsTo(Karyawan, { foreignKey: "karyawan_id" });
//relasai sistgem poiint
// Relasi UserToken ke FlexibilityItem
UserToken.belongsTo(FlexibilityItem, { 
    foreignKey: "item_id", 
    as: "item_detail" 
});

// Kebalikannya (opsional, jika butuh akses dari sisi Item)
FlexibilityItem.hasMany(UserToken, { 
    foreignKey: "item_id", 
    as: "tokens" 
});
// relasi penilaian
// 1. Hubungan Periode ke Penilaian (One-to-Many)
priodePenilaian.hasMany(penilaian, { 
    foreignKey: "priode",
    as: "list_penilaian" 
});
penilaian.belongsTo(priodePenilaian, { 
    foreignKey: "priode",
    as: "periode_detail"
});

// 2. Hubungan Karyawan ke Penilaian (One-to-Many)
Karyawan.hasMany(penilaian, { foreignKey: "karyawan_id" });
penilaian.belongsTo(Karyawan, { foreignKey: "karyawan_id", as: "data_karyawan" });

// 3. Hubungan Penilaian ke Detail (Master-Detail)
penilaian.hasMany(detailPenilaian, { foreignKey: "penilaian_id", as: "rincian_poin" });
detailPenilaian.belongsTo(penilaian, { foreignKey: "penilaian_id" });

// 4. Hubungan Kategori ke Detail (Master-Detail)
kategoryPenilaian.hasMany(detailPenilaian, { foreignKey: "kategori_penilaian_id" });
detailPenilaian.belongsTo(kategoryPenilaian, { foreignKey: "kategori_penilaian_id", as: "kategori" });

// 5. Self-Relation untuk Atasan (Optional tapi Berguna)
// Ini agar kita tahu siapa atasan yang menilai
Karyawan.hasMany(penilaian, { foreignKey: "atasan_id", as: "penilaian_oleh_saya" });
penilaian.belongsTo(Karyawan, { foreignKey: "atasan_id", as: "data_atasan" });

export { 
    User, 
    Karyawan, 
    Divisi, 
    Shift, 
    Jabatan, 
    Absensi, 
    priodePenilaian, 
    penilaian, 
    detailPenilaian, 
    kategoryPenilaian,
    UserTokenInc,
    FlexibilityItemInc
};