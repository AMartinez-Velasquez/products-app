const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

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

// GET - Obtener todos los productos
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});

// POST - Crear un nuevo producto
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const newProduct = await Product.create({
      name,
      description,
      price,
      stock
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ message: 'Error al crear producto', error: error.message });
  }
});

// PUT - Actualizar un producto
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await product.update({
      name,
      description,
      price,
      stock
    });

    res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(400).json({ message: 'Error al actualizar producto', error: error.message });
  }
});

// DELETE - Eliminar un producto
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await product.destroy();
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(400).json({ message: 'Error al eliminar producto', error: error.message });
  }
});

// Iniciar el servidor solo después de sincronizar la base de datos
initializeDatabase().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}); 