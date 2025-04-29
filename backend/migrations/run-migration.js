const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'product_db',
  password: 'postgres',
  port: 5432,
});

async function runMigration() {
  try {
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'add_timestamps.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf8');

    // Ejecutar la migración
    await pool.query(sqlContent);
    console.log('Migración completada exitosamente');
  } catch (error) {
    console.error('Error ejecutando la migración:', error);
  } finally {
    await pool.end();
  }
}

runMigration(); 