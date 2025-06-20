import { useState, useEffect } from 'react';
import { getProducts, getWarehouses, receiveLot } from '../services/api';
import { useNavigate } from 'react-router-dom';

function ReceiveStock() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    lotId: `LOT-${Date.now()}`,
    quantity: '',
    manufactureDate: '',
    expiryDate: '',
    warehouseId: '',
    branchId: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, warehouseRes] = await Promise.all([getProducts(), getWarehouses()]);
        setProducts(productRes.data);
        setWarehouses(warehouseRes.data.filter(wh => wh.branchId === localStorage.getItem('branchId')));
      } catch (err) {
        setError('Error fetching data');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedWarehouse = warehouses.find(wh => wh._id === formData.warehouseId);
      await receiveLot({ ...formData, branchId: selectedWarehouse.branchId });
      navigate('/');
    } catch (err) {
      setError('Error receiving stock');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Receive Stock</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          >
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>{product.name} ({product.sku})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Lot ID</label>
          <input
            type="text"
            name="lotId"
            value={formData.lotId}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Manufacture Date</label>
          <input
            type="date"
            name="manufactureDate"
            value={formData.manufactureDate}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Warehouse</label>
          <select
            name="warehouseId"
            value={formData.warehouseId}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          >
            <option value="">Select Warehouse</option>
            {warehouses.map(wh => (
              <option key={wh._id} value={wh._id}>{wh.name} ({wh.warehouseId})</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Receive Stock
        </button>
      </form>
    </div>
  );
}

export default ReceiveStock;