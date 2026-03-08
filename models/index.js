import User from "./users/index.js"
import Karyawan from "./karyawan/index.js"
import Shift from "./shift/index.js"
import Jabatan from "./jabatan/index.js"
import Divisi from "./divisi/index.js"
import Absensi from "./absensi/index.js"

// Relasi
User.hasOne(Karyawan, {  
  foreignKey: "user_id"
})

Karyawan.belongsTo(User, {
  foreignKey: "user_id"
})

//shift - karyawan
Shift.hasMany(Karyawan,{
  foreignKey: "shift_id"
})
Karyawan.belongsTo(Shift, {
  foreignKey: "shift_id"
})

//jabatan - karyawan
Jabatan.hasMany(Karyawan,{
  foreignKey: "jabatan_id"
})
Karyawan.belongsTo(Jabatan, {
  foreignKey: "jabatan_id"
})

//divisi - karyawan
Divisi.hasMany(Karyawan,{
  foreignKey: "divisi_id"
})
Karyawan.belongsTo(Divisi, {
  foreignKey: "divisi_id"
})

// Karyawan bisa memiliki banyak catatan absensi
Karyawan.hasMany(Absensi, { foreignKey: "karyawan_id" });

// Setiap catatan absensi merujuk ke satu Karyawan
Absensi.belongsTo(Karyawan, { foreignKey: "karyawan_id" });

export { User, Karyawan, Divisi, Shift, Jabatan, Absensi }
