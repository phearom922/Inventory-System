import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReceiveStock() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // ดึง products และ warehouses โดยส่ง branchFilter
      const [productsResponse, warehousesResponse] = await Promise.all([
        axios.get('/api/products', { ...config, params: { branchId: req.branchFilter } }),
        axios.get('/api/warehouses', { ...config, params: { branchId: req.branchFilter } })
      ]);

      setProducts(productsResponse.data);
      setWarehouses(warehousesResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/receive', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Stock received successfully'); // เปลี่ยนเป็น toast ถ้าต้องการ
      setFormData({ productId: '', warehouseId: '', quantity: '' });
      fetchData();
    } catch (error) {
      console.error('Failed to receive stock:', error);
    }
  };

  if (loading) return <div className="text-center p-4 text-blue-600">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Receive Stock</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-blue-600 mb-1">Product</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>
                {product.name} (SKU: {product.sku})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-blue-600 mb-1">Warehouse</label>
          <select
            name="warehouseId"
            value={formData.warehouseId}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Warehouse</option>
            {warehouses.map(warehouse => (
              <option key={warehouse._id} value={warehouse._id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-blue-600 mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Receive Stock
        </button>
      </form>
    </div>
  );
}

// หมายเหตุ: req.branchFilter ต้องถูกส่งจาก middleware ผ่าน context หรือ props
// ตัวอย่างการส่งผ่าน context:
export default function ReceiveStockWithContext(props) {
  const branchFilter = props.branchFilter || []; // รับจาก middleware หรือ context
  const req = { branchFilter }; // จำลอง req
  return <ReceiveStock {...props} />;
}