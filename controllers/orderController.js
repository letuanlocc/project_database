const { NumberKH, KhachHang, DiaChi, DatSan, San, SanCauLong, SanBongDa, NhanVien, ThanhToan, DichVu, SuDungDV } = require('../models/product.js');
const { sequelize } = require('../models/product.js'); 
exports.Checknumber = async (req, res) => {
    try {
        const sdt = req.body.sdt;

        const result = await NumberKH.findOne({
            where: {
                soDienThoai: sdt
            },
            include: [
                {
                    model: KhachHang,
                    include: [
                        {
                            model: DatSan,
                            include: [
                                { model: San },
                                { model: NhanVien },
                                { model: ThanhToan }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!result) {
            return res.json({
                found: false
            });
        }

        const customer = result.KhachHang;
        const bookings = customer.DatSans || [];

        res.json({
            found: true,
            customer: {
                id_kh: customer.id_kh,
                ten: customer.ten,
                gioiTinh: customer.gioiTinh,
                ngaySinh: customer.ngaySinh
            },
            bookings: bookings.map((booking) => ({
                ma_dat: booking.ma_dat,
                ngayDat: booking.ngayDat,
                thoiGianBatDau: booking.thoiGianBatDau,
                thoiGianKetThuc: booking.thoiGianKetThuc,
                tongTien: booking.tongTien,
                san: booking.San ? {
                    ma_san: booking.San.ma_san,
                    ten: booking.San.ten,
                    trangThai: booking.San.trangThai,
                    gia: booking.San.gia
                } : null,
                employee: booking.NhanVien ? {
                    ma_nv: booking.NhanVien.ma_nv,
                    hoTen: booking.NhanVien.hoTen,
                    chucVu: booking.NhanVien.chucVu
                } : null,
                payment: booking.ThanhToan ? {
                    phuongThuc: booking.ThanhToan.phuongThuc,
                    soTien: booking.ThanhToan.soTien,
                    thoiGian: booking.ThanhToan.thoiGian
                } : null
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Lỗi kiểm tra số điện thoại' });
    }
};

exports.createCustomer = async (req, res) => {
    const { sdt, ten, gioiTinh, ngaySinh, soNha, duong, thanhPho } = req.body;

    if (!sdt || !ten || !soNha || !duong || !thanhPho) {
        return res.status(400).json({ error: 'Thiếu thông tin khách hàng hoặc địa chỉ' });
    }

    const transaction = await KhachHang.sequelize.transaction();

    try {
        const existing = await NumberKH.findOne({
            where: { soDienThoai: sdt }
        });

        if (existing) {
            await transaction.rollback();
            return res.status(409).json({ error: 'Số điện thoại đã tồn tại' });
        }

        const customer = await KhachHang.create({
            ten,
            gioiTinh,
            ngaySinh
        }, { transaction });

        await customer.createNumberKH({
            soDienThoai: sdt
        }, { transaction });

        await customer.createDiaChi({
            soNha,
            duong,
            thanhPho
        }, { transaction });

        await transaction.commit();

        res.json({
            message: 'Lưu khách hàng thành công',
            customer: {
                id_kh: customer.id_kh,
                ten: customer.ten,
                gioiTinh: customer.gioiTinh,
                ngaySinh: customer.ngaySinh
            }
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: error.message || 'Lỗi lưu khách hàng' });
    }
};

exports.getYardsByType = async (req, res) => {
    try {
        const loai = req.query.loai;
        if (!loai) {
            return res.status(400).json({ error: 'Thiếu loại sân' });
        }

        let include;
        if (loai === 'cau_long') {
            include = [{ model: SanCauLong, attributes: ['chieuCaoLuoi'], required: true }];
        } else if (loai === 'bong_da') {
            include = [{ model: SanBongDa, attributes: ['chieuDai'], required: true }];
        } else {
            return res.status(400).json({ error: 'Loại sân không hợp lệ' });
        }

        const yards = await San.findAll({
            include,
            order: [['ma_san', 'ASC']]
        });

        res.json({
            loaiSan: loai,
            count: yards.length,
            yards: yards.map((yard) => ({
                ma_san: yard.ma_san,
                ten: yard.ten,
                gia: yard.gia,
                trangThai: yard.trangThai,
                extra: loai === 'cau_long' ? yard.SanCauLong?.chieuCaoLuoi : yard.SanBongDa?.chieuDai
            }))
        });
    } catch (error) {        if (transaction) {
            await transaction.rollback();
        }        console.error(error);
        res.status(500).json({ error: error.message || 'Lỗi lấy danh sách sân' });
    }
};

exports.createBooking = async (req, res) => {
    let transaction;
    try {
        const { sdt, loaiSan, ma_san, ngayDat, thoiGianBatDau, thoiGianKetThuc, phuongThuc, ma_dv, soLuong } = req.body;

        if (!sdt || !loaiSan || !ma_san || !ngayDat || !thoiGianBatDau || !thoiGianKetThuc || !phuongThuc) {
            return res.status(400).json({ error: 'Thiếu thông tin đặt sân hoặc phương thức thanh toán' });
        }

        const phone = await NumberKH.findOne({
            where: { soDienThoai: sdt }
        });

        if (!phone) {
            return res.status(404).json({ error: 'Số điện thoại chưa tồn tại' });
        }

        const san = await San.findOne({
            where: { ma_san },
            include: [
                { model: SanCauLong, attributes: ['chieuCaoLuoi'] },
                { model: SanBongDa, attributes: ['chieuDai'] }
            ]
        });

        if (!san) {
            return res.status(404).json({ error: 'Không tìm thấy sân' });
        }

        if (loaiSan === 'cau_long' && !san.SanCauLong) {
            return res.status(400).json({ error: 'Sân này không phải sân cầu lông' });
        }

        if (loaiSan === 'bong_da' && !san.SanBongDa) {
            return res.status(400).json({ error: 'Sân này không phải sân bóng đá' });
        }

        const start = new Date(`${ngayDat}T${thoiGianBatDau}`);
        const end = new Date(`${ngayDat}T${thoiGianKetThuc}`);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
            return res.status(400).json({ error: 'Thời gian đặt sân không hợp lệ' });
        }

        const durationHours = Math.round(((end - start) / 3600000) * 100) / 100;
        if (durationHours <= 0) {
            return res.status(400).json({ error: 'Thời gian đặt phải lớn hơn 0' });
        }

        const formatSqlDateTime = (date) => {
            const pad2 = (value) => String(value).padStart(2, '0');
            const pad3 = (value) => String(value).padStart(3, '0');
            return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}.${pad3(date.getMilliseconds())}`;
        };

        const employees = await NhanVien.findAll({
            include: [{ model: DatSan, attributes: ['ma_dat'] }]
        });

        if (!employees || employees.length === 0) {
            return res.status(400).json({ error: 'Không có nhân viên để phân công' });
        }

        let chosenEmployee = employees[0];
        let minOrders = chosenEmployee.DatSans ? chosenEmployee.DatSans.length : 0;

        for (const employee of employees) {
            const count = employee.DatSans ? employee.DatSans.length : 0;
            if (count < minOrders) {
                minOrders = count;
                chosenEmployee = employee;
            }
        }

        let serviceInfo = null;
        let serviceTotal = 0;

        if (ma_dv) {
            const service = await DichVu.findByPk(ma_dv);
            if (!service) {
                return res.status(404).json({ error: 'Không tìm thấy dịch vụ' });
            }

            const quantity = Number(soLuong) || 1;
            if (quantity <= 0) {
                return res.status(400).json({ error: 'Số lượng dịch vụ phải lớn hơn 0' });
            }

            serviceTotal = Number(service.gia) * quantity;
            serviceInfo = {
                ma_dv: service.ma_dv,
                ten: service.ten,
                gia: service.gia,
                soLuong: quantity
            };
        }

        const totalPrice = Number(san.gia) * durationHours + serviceTotal;

        transaction = await NumberKH.sequelize.transaction();

        const booking = await DatSan.create({
            id_kh: phone.id_kh,
            ma_nv: chosenEmployee.ma_nv,
            ma_san,
            ngayDat,
            thoiGianBatDau: start,
            thoiGianKetThuc: end,
            tongTien: totalPrice
        }, { transaction });

        if (serviceInfo) {
            await SuDungDV.create({
                ma_dat: booking.ma_dat,
                ma_dv: serviceInfo.ma_dv,
                soLuong: serviceInfo.soLuong
            }, { transaction });
        }

        const payment = await booking.createThanhToan({
            phuongThuc,
            soTien: totalPrice,
            thoiGian: sequelize.literal('GETDATE()')
        }, { transaction });

        await transaction.commit();

        res.json({
            message: 'Đặt sân thành công',
            booking: {
                ma_dat: booking.ma_dat,
                ngayDat: booking.ngayDat,
                thoiGianBatDau: booking.thoiGianBatDau,
                thoiGianKetThuc: booking.thoiGianKetThuc,
                tongTien: booking.tongTien,
                loaiSan,
                san: {
                    ma_san: san.ma_san,
                    ten: san.ten,
                    gia: san.gia,
                    extra: loaiSan === 'cau_long' ? san.SanCauLong?.chieuCaoLuoi : san.SanBongDa?.chieuDai
                },
                dichVu: serviceInfo
            },
            payment: {
                phuongThuc: payment.phuongThuc,
                soTien: payment.soTien,
                thoiGian: payment.thoiGian
            },
            customer: {
                id_kh: phone.id_kh,
                sdt
            },
            employee: {
                ma_nv: chosenEmployee.ma_nv,
                hoTen: chosenEmployee.hoTen,
                chucVu: chosenEmployee.chucVu
            }
        });
    } catch (error) {
        if (transaction) {
            try {
                await transaction.rollback();
            } catch (rollbackError) {
                console.error('Rollback error:', rollbackError);
            }
        }
        console.error('createBooking error:', error);
        res.status(500).json({ error: error.message || 'Lỗi tạo đặt sân' });
    }
};

exports.getServices = async (req, res) => {
    try {
        const services = await DichVu.findAll();

        res.json({
            services
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};