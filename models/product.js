const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    'QuanLySanTheThao',
    'sa',
    '123456',
    {
        host: 'localhost',
        dialect: 'mssql',
        dialectOptions: {
            options: {
                trustServerCertificate: true,
                useUTC: false
            },
            useUTC: false 
        },
        timezone: '+07:00'
    }
);

// ================= KHACH_HANG =================

const KhachHang = sequelize.define('KhachHang', {
    id_kh: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ten: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gioiTinh: DataTypes.STRING,
    ngaySinh: DataTypes.DATEONLY
}, {
    tableName: 'Khach_hang',
    timestamps: false
});

// ================= DIA_CHI =================

const DiaChi = sequelize.define('DiaChi', {
    id_kh: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    soNha: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    duong: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    thanhPho: {
        type: DataTypes.STRING,
        primaryKey: true
    }
}, {
    tableName: 'Dia_chi',
    timestamps: false
});

// ================= NUMBER_KH =================

const NumberKH = sequelize.define('NumberKH', {
    id_kh: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    soDienThoai: {
        type: DataTypes.STRING,
        primaryKey: true
    }
}, {
    tableName: 'Number_KH',
    timestamps: false
});

// ================= NHAN_VIEN =================

const NhanVien = sequelize.define('NhanVien', {
    ma_nv: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hoTen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    luong: DataTypes.DECIMAL(12,2),
    chucVu: DataTypes.STRING
}, {
    tableName: 'Nhan_vien',
    timestamps: false
});

// ================= SAN =================

const San = sequelize.define('San', {
    ma_san: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ten: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trangThai: DataTypes.STRING,
    gia: DataTypes.DECIMAL(12,2)
}, {
    tableName: 'San',
    timestamps: false
});

// ================= SAN_CAU_LONG =================

const SanCauLong = sequelize.define('SanCauLong', {
    ma_san: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'San',
            key: 'ma_san'
        }
    },
    chieuCaoLuoi: DataTypes.DECIMAL(5,2)
}, {
    tableName: 'San_cau_long',
    timestamps: false
});

// ================= SAN_BONG_DA =================

const SanBongDa = sequelize.define('SanBongDa', {
    ma_san: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'San',
            key: 'ma_san'
        }
    },
    chieuDai: DataTypes.DECIMAL(5,2)
}, {
    tableName: 'San_bong_da',
    timestamps: false
});

// ================= DICH_VU =================

const DichVu = sequelize.define('DichVu', {
    ma_dv: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ten: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gia: DataTypes.DECIMAL(12,2)
}, {
    tableName: 'Dich_vu',
    timestamps: false
});

// ================= DAT_SAN =================

const DatSan = sequelize.define('DatSan', {
    ma_dat: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_kh: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    ma_nv: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    ma_san: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    ngayDat: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    thoiGianBatDau: {
        type: DataTypes.DATE,
        allowNull: false
    },

    thoiGianKetThuc: {
        type: DataTypes.DATE,
        allowNull: false
    },

    tongTien: {
        type: DataTypes.DECIMAL(12,2),
        defaultValue: 0
    }
}, {
    tableName: 'Dat_san',
    timestamps: false,
    hasTrigger: true
});

// ================= THANH_TOAN =================

const ThanhToan = sequelize.define('ThanhToan', {
    ma_tt: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
     ma_dat: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    phuongThuc: DataTypes.STRING,
    soTien: DataTypes.DECIMAL(12,2),
    thoiGian: DataTypes.DATE
}, {
    tableName: 'Thanh_toan',
    timestamps: false
});

// ================= SU_DUNG_DV =================

const SuDungDV = sequelize.define('SuDungDV', {
    ma_dat: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    ma_dv: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    soLuong: DataTypes.INTEGER
}, {
    tableName: 'Su_dung_dv',
    timestamps: false
});

// ================= ASSOCIATIONS =================

// Khách hàng - Địa chỉ
KhachHang.hasMany(DiaChi, { foreignKey: 'id_kh' });
DiaChi.belongsTo(KhachHang, { foreignKey: 'id_kh' });

// Khách hàng - SĐT
KhachHang.hasMany(NumberKH, { foreignKey: 'id_kh' });
NumberKH.belongsTo(KhachHang, { foreignKey: 'id_kh' });

// Khách hàng - Đặt sân
KhachHang.hasMany(DatSan, { foreignKey: 'id_kh' });
DatSan.belongsTo(KhachHang, { foreignKey: 'id_kh' });

// Nhân viên - Đặt sân
NhanVien.hasMany(DatSan, { foreignKey: 'ma_nv' });
DatSan.belongsTo(NhanVien, { foreignKey: 'ma_nv' });

// Sân - Đặt sân
San.hasMany(DatSan, { foreignKey: 'ma_san' });
DatSan.belongsTo(San, { foreignKey: 'ma_san' });

// Sân cầu lông
San.hasOne(SanCauLong, { foreignKey: 'ma_san' });
SanCauLong.belongsTo(San, { foreignKey: 'ma_san' });

// Sân bóng đá
San.hasOne(SanBongDa, { foreignKey: 'ma_san' });
SanBongDa.belongsTo(San, { foreignKey: 'ma_san' });

// Thanh toán
DatSan.hasOne(ThanhToan, { foreignKey: 'ma_dat' });
ThanhToan.belongsTo(DatSan, { foreignKey: 'ma_dat' });

// Sử dụng dịch vụ
DatSan.belongsToMany(DichVu, {
    through: SuDungDV,
    foreignKey: 'ma_dat'
});

DichVu.belongsToMany(DatSan, {
    through: SuDungDV,
    foreignKey: 'ma_dv'
});

module.exports = {
    sequelize,
    KhachHang,
    DiaChi,
    NumberKH,
    NhanVien,
    San,
    SanCauLong,
    SanBongDa,
    DichVu,
    DatSan,
    ThanhToan,
    SuDungDV
};