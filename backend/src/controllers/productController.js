const Product = require('../../models/Product');

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
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
};

// Actualizar un producto
const updateProduct = async (req, res) => {
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
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
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
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
}; 