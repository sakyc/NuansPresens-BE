import crypto from 'crypto';
import Qr_absensi from '../../models/qr_absensi/index.js';

let dinamisQr = async (req, res) => {
    try {
        const { type } = req.body; // 'masuk' atau 'keluar'
        let idType = type === 'masuk' ? 1 : 2;
        const newCode = crypto.randomBytes(12).toString('hex');
        
        
        await Qr_absensi.update({ 
            token: newCode, 
            type: type,
            status: 'aktif',
            updatedAt: new Date()
        }, { 
            where: { id: idType } 
        });

        
        
        console.log(newCode);
        res.json({ 
            status: 'success', 
            data: {
                token: newCode,
                type: type
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

let SeederQR = async (req, res) => {
    await Qr_absensi.bulkCreate([
        {
            token: 'asdfafsafafda',
            status: 'aktif',
            type: 'masuk',
        },
        {
            token: 'afasf3faafaf',
            status: 'aktif',
            type: 'keluar',
        }
    ]);
    res.json({ message: "Seeder qr berhasil dijalankan" });
}
export { dinamisQr, SeederQR };