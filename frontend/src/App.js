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
  const [editingId, setEditingId] = useState(null);

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
      if (editingId) {
        await axios.put(`http://localhost:3001/api/products/${editingId}`, newProduct);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:3001/api/products', newProduct);
      }
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock: ''
      });
      fetchProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        console.log('Intentando eliminar producto con ID:', id);
        const response = await axios.delete(`http://localhost:3001/api/products/${id}`);
        console.log('Respuesta del servidor:', response);
        
        if (response.status === 200) {
          setProducts(products.filter(product => product.id !== id));
          alert('Producto eliminado con éxito');
        }
      } catch (error) {
        console.error('Error completo:', error);
        console.error('Status del error:', error.response?.status);
        console.error('Datos del error:', error.response?.data);
        
        if (error.response?.status === 404) {
          alert('El producto no fue encontrado. Puede que ya haya sido eliminado.');
        } else {
          alert(`Error al eliminar el producto: ${error.response?.data?.message || 'Error desconocido'}`);
        }
      }
    }
  };

  const handleCancel = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      stock: ''
    });
    setEditingId(null);
  };

  return (
    <div className="App">
      <h1>Sistema de Gestión de Productos</h1>
      
      <div className="product-form">
        <h2>{editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
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
          <div className="form-buttons">
            <button type="submit">{editingId ? 'Actualizar' : 'Agregar Producto'}</button>
            {editingId && (
              <button type="button" onClick={handleCancel}>Cancelar</button>
            )}
          </div>
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(product)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(product.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App; 