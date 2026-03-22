import crypto from 'crypto';
import Qr_absensi from '../../models/qr_absensi/index.js';

let dinamisQr = async (req, res) => {
    try {
        const { type } = req.body; 
        const newCode = crypto.randomBytes(12).toString('hex');
        
        
        await Qr_absensi.update({ 
            token: newCode, 
            type: type,
            status: 'aktif',
            updatedAt: new Date()
        }, { 
            where: { type: type } 
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

let getQr_status = async (req, res) => {
    const { type } = req.body;
    try {
        const data = await Qr_absensi.findOne({ where: { type: type } });
        res.json({ status: data.status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

let closeQr = async (req, res) => {
    const { type } = req.body;
    try {
        await Qr_absensi.update({ status: 'non-aktif' }, { where: { type: type } });
        res.json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export { dinamisQr, getQr_status, closeQr };