const sql = require('mssql');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433;
const dbInstance = process.env.DB_INSTANCE ? process.env.DB_INSTANCE.trim() : null;
const dbEncrypt = process.env.DB_ENCRYPT ? process.env.DB_ENCRYPT.toLowerCase() === 'true' : true;
const dbTrustServerCertificate = process.env.DB_TRUST_SERVER_CERTIFICATE
  ? process.env.DB_TRUST_SERVER_CERTIFICATE.toLowerCase() === 'true'
  : true;

const config = {
  user: dbUser,
  password: dbPassword,
  server: dbHost,
  database: dbName,
  options: {
    encrypt: dbEncrypt,
    trustServerCertificate: dbTrustServerCertificate,
  },
};

if (dbInstance) {
  config.options.instanceName = dbInstance;
} else {
  config.port = dbPort;
}

let pool;

async function connectDatabase() {
  try {
    pool = await sql.connect(config);
    console.log('Database connected');
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error.message || error);
    throw error;
  }
}

module.exports = { connectDatabase, sql, getPool: () => pool };
