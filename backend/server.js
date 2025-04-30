const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// Importar controladores
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('./src/controllers/productController');

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar modelo
const Product = require('./models/Product');

// Inicializar la base de datos
const initializeDatabase = async () => {
  try {
    // Primero verificar si la tabla existe
    const tableExists = await sequelize.getQueryInterface().showAllTables()
      .then(tables => tables.includes('products'));

    if (!tableExists) {
      // Si la tabla no existe, crearla con todas las columnas
      await sequelize.sync();
    } else {
      // Si la tabla existe, intentar actualizar los campos faltantes de manera segura
      await Product.sync({ alter: true, force: false });
    }
    
    console.log('Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    process.exit(1);
  }
};

// Rutas
app.get('/api/products', getAllProducts);
app.post('/api/products', createProduct);
app.put('/api/products/:id', updateProduct);
app.delete('/api/products/:id', deleteProduct);

// Iniciar el servidor solo después de sincronizar la base de datos
initializeDatabase().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}); 