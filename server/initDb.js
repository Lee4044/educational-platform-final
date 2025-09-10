import { createAllTables } from './utils/dbSchema.js';
import { initializeDatabase } from './config/db.js';

async function initializeApp() {
  try {
    console.log('🔄 Initializing database connection...');
    await initializeDatabase();
    
    console.log('🔄 Creating database tables...');
    await createAllTables();
    
    console.log('✅ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeApp();