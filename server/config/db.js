import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let db = null;

const getDatabase = async () => {
  if (!db) {
    try {
      db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'education_database',
        port: process.env.DB_PORT || 3306
      });
      
      console.log('✅ MySQL database connected successfully');
    } catch (error) {
      console.error('❌ MySQL connection failed:', error.message);
      throw error;
    }
  }
  return db;
};

const checkConnection = async () => {
  try {
    const database = await getDatabase();
    await database.execute('SELECT 1');
    console.log('🔄 MySQL database connection verified');
  } catch (error) {
    console.error('Failed to verify MySQL connection:', error.message);
    throw error;
  }
};

const initializeDatabase = async () => {
  try {
    await checkConnection();
    console.log('🔄 MySQL database initialized');
  } catch (error) {
    console.error('Failed to initialize MySQL database:', error.message);
    throw error;
  }
};

export { getDatabase, checkConnection, initializeDatabase };