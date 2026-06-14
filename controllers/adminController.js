const path = require('path');
const { NhanVien, DichVu, San, SanCauLong, SanBongDa, DatSan, SuDungDV } = require('../models/product.js');
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
        const employees = await NhanVien.findAll({
            include: [{ model: DatSan, attributes: ['ma_dat'] }]
        });

        const response = employees.map((employee) => ({
            ma_nv: employee.ma_nv,
            hoTen: employee.hoTen,
            luong: employee.luong,
            chucVu: employee.chucVu,
            bookingCount: employee.DatSans ? employee.DatSans.length : 0
        }));

        res.json(response);
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

        const usedCount = await SuDungDV.count({
            where: { ma_dv: id }
        });

        if (usedCount > 0) {
            return res.status(400).json({ error: 'Không thể xóa dịch vụ vì đang được sử dụng trong các đặt sân/dịch vụ.' });
        }

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
        const assignedBookings = await DatSan.count({ where: { ma_nv: id } });

        if (assignedBookings > 0) {
            return res.status(400).json({ error: 'Không thể xóa nhân viên đang phụ trách đặt sân.' });
        }

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

exports.addYard = async (req, res) => {
    const { ten, trangThai, gia, loaiSan, chieuCaoLuoi, chieuDai } = req.body;

    if (!ten || !trangThai || !gia || !loaiSan) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc để thêm sân' });
    }

    const transaction = await San.sequelize.transaction();

    try {
        const san = await San.create({
            ten,
            trangThai,
            gia
        }, { transaction });

        if (loaiSan === 'cau_long') {
            if (!chieuCaoLuoi) {
                throw new Error('Chưa nhập chiều cao lưới cho sân cầu lông');
            }

            await SanCauLong.create({
                ma_san: san.ma_san,
                chieuCaoLuoi: chieuCaoLuoi
            }, { transaction });
        } else if (loaiSan === 'bong_da') {
            if (!chieuDai) {
                throw new Error('Chưa nhập chiều dài cho sân bóng đá');
            }

            await SanBongDa.create({
                ma_san: san.ma_san,
                chieuDai: chieuDai
            }, { transaction });
        } else {
            throw new Error('Loại sân không hợp lệ');
        }

        await transaction.commit();
        res.json({ message: 'Thêm sân thành công', ma_san: san.ma_san });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: error.message || 'Lỗi thêm sân' });
    }
};

exports.getAllYard = async (req, res) => {
    try {
        const yards = await San.findAll({
            include: [
                { model: SanCauLong, attributes: ['chieuCaoLuoi'] },
                { model: SanBongDa, attributes: ['chieuDai'] }
            ],
            order: [['ma_san', 'ASC']]
        });

        const response = yards.map((yard) => ({
            ma_san: yard.ma_san,
            ten: yard.ten,
            trangThai: yard.trangThai,
            gia: yard.gia,
            loaiSan: yard.SanCauLong ? 'cau_long' : yard.SanBongDa ? 'bong_da' : 'khac',
            chieuCaoLuoi: yard.SanCauLong ? yard.SanCauLong.chieuCaoLuoi : null,
            chieuDai: yard.SanBongDa ? yard.SanBongDa.chieuDai : null
        }));

        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteYard = async (req, res) => {
    try {
        const id = req.params.id;

        const linkedCauLong = await SanCauLong.count({ where: { ma_san: id } });
        const linkedBongDa = await SanBongDa.count({ where: { ma_san: id } });
        const linkedDatSan = await DatSan.count({ where: { ma_san: id } });

        if (linkedCauLong > 0 || linkedBongDa > 0) {
            return res.status(400).json({ error: 'Không thể xóa sân vì đang có thông tin chi tiết sân liên kết.' });
        }

        if (linkedDatSan > 0) {
            return res.status(400).json({ error: 'Không thể xóa sân vì đã có lịch đặt sân.' });
        }

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

exports.updateEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const { hoTen, luong, chucVu } = req.body;
        const employee = await NhanVien.findByPk(id);
        if (!employee) return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
        await employee.update({ hoTen, luong, chucVu });
        res.json({ message: 'Cập nhật nhân viên thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi cập nhật nhân viên' });
    }
};

exports.updateService = async (req, res) => {
    try {
        const id = req.params.id;
        const { ten, gia } = req.body;
        const service = await DichVu.findByPk(id);
        if (!service) return res.status(404).json({ error: 'Không tìm thấy dịch vụ' });
        await service.update({ ten, gia });
        res.json({ message: 'Cập nhật dịch vụ thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi cập nhật dịch vụ' });
    }
};

exports.updateYard = async (req, res) => {
    const transaction = await San.sequelize.transaction();
    try {
        const id = req.params.id;
        const { ten, trangThai, gia, loaiSan, chieuCaoLuoi, chieuDai } = req.body;

        const san = await San.findByPk(id, { transaction });
        if (!san) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Không tìm thấy sân' });
        }

        await san.update({ ten, trangThai, gia }, { transaction });

        // remove existing detail rows, then insert/update based on loaiSan
        await SanCauLong.destroy({ where: { ma_san: id }, transaction });
        await SanBongDa.destroy({ where: { ma_san: id }, transaction });

        if (loaiSan === 'cau_long') {
            if (!chieuCaoLuoi) throw new Error('Chưa nhập chiều cao lưới cho sân cầu lông');
            await SanCauLong.create({ ma_san: id, chieuCaoLuoi }, { transaction });
        } else if (loaiSan === 'bong_da') {
            if (!chieuDai) throw new Error('Chưa nhập chiều dài cho sân bóng đá');
            await SanBongDa.create({ ma_san: id, chieuDai }, { transaction });
        }

        await transaction.commit();
        res.json({ message: 'Cập nhật sân thành công' });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: error.message || 'Lỗi cập nhật sân' });
    }
};