const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function initDB() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing database schema setup...');
    await pool.query(schema);
    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error executing schema:', error);
  } finally {
    pool.end();
  }
}

initDB();
