const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('product_db', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false, // Desactivar logs SQL
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

testConnection();

module.exports = sequelize; 