const path = require('path');
const { NhanVien } = require('../models/product.js');
const {DichVu } = require('../models/product.js');
const {San} = require('../models/product.js');
exports.index = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
};

exports.addEmployee = async (req, res) => {
   try {
        const { hoTen, luong, chucVu } = req.body;
        await NhanVien.create({
            hoTen,
            luong,
            chucVu
        });
        res.json({ message: 'Thêm nhân viên thành công' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi thêm nhân viên' });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await NhanVien.findAll();
        res.json(employees); // CHẮC CHẮN phải là json
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addService = async (req,res) => {
try{
    const {ten, gia} = req.body;
    await DichVu.create({
        ten,
        gia
    })
    res.json({ message: 'Thêm dịch vụ thành công' });
}
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi thêm dịch vụ' });
    }
}

exports.getAllService = async (req, res) => {
    try {
        const service = await DichVu.findAll();
        res.json(service); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await DichVu.destroy({
            where: { ma_dv: id }
        });

        if (deleted === 0) {
            return res.status(404).json({ error: 'Không tìm thấy dịch vụ' });
        }

        res.json({ message: 'Xoá thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi xoá dịch vụ' });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await NhanVien.destroy({
            where: { ma_nv: id }
        });

        if (deleted === 0) {
            return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
        }

        res.json({ message: 'Xoá thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi xoá nhân viên' });
    }
};

exports.addYard= async (req,res) => {
try{
    const {ten,trangThai,gia} = req.body;
    await San.create({
        ten,
        trangThai,
        gia
    })
    res.json({ message: 'Thêm sân thành công' });
}catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi thêm sân' });
    }
}

exports.getAllYard = async (req, res) => {
    try {
        const yard = await San.findAll();
        res.json(yard); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteYard = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await San.destroy({
            where: { ma_san: id }
        });

        if (deleted === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sân' });
        }

        res.json({ message: 'Xoá thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi xoá sân' });
    }
};