import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/products', newProduct);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock: ''
      });
      fetchProducts();
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  return (
    <div className="App">
      <h1>Sistema de Gestión de Productos</h1>
      
      <div className="product-form">
        <h2>Agregar Nuevo Producto</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Descripción"
            value={newProduct.description}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Agregar Producto</button>
        </form>
      </div>

      <div className="product-list">
        <h2>Lista de Productos</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App; 