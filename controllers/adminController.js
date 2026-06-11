const path = require('path');
const { NhanVien } = require('../models/product.js');
const {DichVu } = require('../models/product.js');

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
        res.send('Thêm nhân viên thành công');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Lỗi thêm nhân viên');
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
    res.send('Thêm dịch vụ thành công');
}
    catch (error) {
        console.error(error);
        res.status(500).send('Lỗi thêm dịch vụ');
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

        await DichVu.destroy({
            where: { ma_dv: id }
        });

        res.send('Xoá thành công');
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi xoá dịch vụ');
    }
};