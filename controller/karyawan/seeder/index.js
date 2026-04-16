import UserModel from "../../../models/users/index.js";
import KaryawanModel from "../../../models/karyawan/index.js";
import bcrypt from "bcryptjs";

let seeder_karyawan_user = async (req, res) => {
    try {
        const saltRounds = 10;
        const passwordSua = await bcrypt.hash("sua", saltRounds);
        const passwordDefault = await bcrypt.hash("Karyawan123", saltRounds);

        
        const dataKaryawan = [
            { id: 2, nip: "admin01", nama: "Nuansua Admin", role: "admin", shift_id: 2, divisi_id: 3, jabatan_id: 1, email: "admin@gmail.com", no_hp: "6285798157896", foto: "admin.jpg", gender: "L", alamat: "Cianjur", tgl_lahir: "1990-01-01", atasan_id: null },
            { id: 3, nip: "manager01", nama: "Budi Manager", role: "manager", shift_id: 1, divisi_id: 1, jabatan_id: 1, email: "budi@manager.com", no_hp: "628111111111", foto: "budi.jpg", gender: "L", alamat: "Cianjur", tgl_lahir: "1985-05-12", atasan_id: null },
            { id: 4, nip: "manager02", nama: "Siti Rahayu", role: "manager", shift_id: 1, divisi_id: 2, jabatan_id: 1, email: "siti@manager.com", no_hp: "628222222222", foto: "siti.jpg", gender: "P", alamat: "Cianjur", tgl_lahir: "1988-08-20", atasan_id: null },
            { id: 5, nip: "kry01", nama: "Karyawan A", role: "karyawan", shift_id: 1, divisi_id: 1, jabatan_id: 3, email: "kry1@mail.com", no_hp: "628500001", foto: "1.jpg", gender: "L", alamat: "Cianjur", tgl_lahir: "1995-03-15", atasan_id: 3 },
            { id: 6, nip: "kry06", nama: "Rizky Perdana", role: "karyawan", shift_id: 2, divisi_id: 2, jabatan_id: 3, email: "rizky@mail.com", no_hp: "6285700006", foto: "6.jpg", gender: "L", alamat: "Cianjur", tgl_lahir: "1996-07-22", atasan_id: 3 },
            { id: 7, nip: "kry07", nama: "Siti Aminah", role: "karyawan", shift_id: 1, divisi_id: 1, jabatan_id: 3, email: "siti_a@mail.com", no_hp: "6285700007", foto: "7.jpg", gender: "P", alamat: "Cianjur", tgl_lahir: "1997-11-30", atasan_id: 3 },
            { id: 8, nip: "kry08", nama: "Dani Ramdani", role: "karyawan", shift_id: 2, divisi_id: 3, jabatan_id: 4, email: "dani@mail.com", no_hp: "6285700008", foto: "8.jpg", gender: "L", alamat: "Cianjur", tgl_lahir: "1994-02-10", atasan_id: 3 },
            { id: 9, nip: "kry09", nama: "Putri Lestari", role: "karyawan", shift_id: 1, divisi_id: 4, jabatan_id: 3, email: "putri@mail.com", no_hp: "6285700009", foto: "9.jpg", gender: "P", alamat: "Cianjur", tgl_lahir: "1998-09-05", atasan_id: 3 }
        ];

        // 2. Loop Insert Data
        for (let item of dataKaryawan) {
            // Hash Password berdasarkan role
            let passHash = (item.role === 'admin' || item.role === 'manager') 
                           ? passwordSua 
                           : passwordDefault;

            // Step 1: Buat User
            let newUser = await UserModel.create({
                username: item.nip,
                password: passHash,
                role: item.role
            });

            // Step 2: Buat Karyawan
            await KaryawanModel.create({
                id: item.id,
                user_id: newUser.id,
                shift_id: item.shift_id,
                divisi_id: item.divisi_id,
                jabatan_id: item.jabatan_id,
                atasan_id: item.atasan_id,
                nama: item.nama,
                nip: item.nip,
                tanggal_lahir: item.tgl_lahir, 
                email: item.email,
                no_hp: item.no_hp,
                foto: item.foto,
                gender: item.gender,
                alamat: item.alamat,
                status: "aktif"
            });
        }

        if (res) return res.json({ message: "Seeder Karyawan, User, dan Tanggal Lahir sukses!" });

    } catch (error) {
        console.error("Seeder Error:", error);
        if (res) return res.status(500).json({ message: error.message });
    }
};

export default seeder_karyawan_user;