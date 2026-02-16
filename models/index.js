import User from "./users/index.js"
import Karyawan from "./karyawan/index.js"
import Shift from "./shift/index.js"
import Jabatan from "./jabatan/index.js"
import Divisi from "./divisi/index.js"

// Relasi
User.hasOne(Karyawan, {  
  foreignKey: "user_id"
})

Karyawan.belongsTo(User, {
  foreignKey: "user_id"
})

//shift
Shift.hasMany(Karyawan,{
  foreignKey: "shift_id"
})
Karyawan.belongsTo(Shift, {
  foreignKey: "shift_id"
})

//jabatan
Jabatan.hasMany(Karyawan,{
  foreignKey: "jabatan_id"
})
Karyawan.belongsTo(Jabatan, {
  foreignKey: "jabatan_id"
})

//divisi
Divisi.hasMany(Karyawan,{
  foreignKey: "divisi_id"
})
Karyawan.belongsTo(Divisi, {
  foreignKey: "divisi_id"
})

export { User, Karyawan, Divisi, Shift, Jabatan }
