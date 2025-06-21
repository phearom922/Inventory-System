import { useState, useEffect } from 'react';
import { getProducts, receiveLot, getWarehouses } from '../services/api';
import { FaArrowDown } from 'react-icons/fa';

function ReceiveStock() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    quantity: '',
    expiryDate: '',
    manufactureDate: '',
    lotId: '', // เพิ่ม lotId
    branchId: '' // เพิ่ม branchId
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, whRes] = await Promise.all([getProducts(), getWarehouses()]);
        setProducts(prodRes.data || []); // ตรวจสอบว่า prodRes.data เป็น array
        setWarehouses(whRes.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.warehouseId || !formData.quantity || !formData.expiryDate || !formData.manufactureDate || !formData.lotId || !formData.branchId) {
      setError('Please fill all required fields');
      return;
    }
    try {
      await receiveLot(formData);
      setFormData({ productId: '', warehouseId: '', quantity: '', expiryDate: '', manufactureDate: '', lotId: '', branchId: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to receive lot');
    }
  };

  if (loading) return <div className="text-center p-4 text-blue-600">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
        <FaArrowDown className="mr-2" /> Receive Stock
      </h1>

      {/* Form รับสินค้า */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Receive Stock Form</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-blue-600 mb-1">Select Product</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Product</option>
              {products.map(prod => (
                <option key={prod._id} value={prod._id}>
                  {prod.name} ({prod.sku})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Select Warehouse</label>
            <select
              name="warehouseId"
              value={formData.warehouseId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Warehouse</option>
              {warehouses.map(wh => (
                <option key={wh._id} value={wh._id}>
                  {wh.name} ({wh.warehouseId})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Lot ID</label>
            <input
              type="text"
              name="lotId"
              value={formData.lotId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., LOT-001"
            />
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Branch ID</label>
            <input
              type="text"
              name="branchId"
              value={formData.branchId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., BR-001"
            />
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Manufacture Date</label>
            <input
              type="date"
              name="manufactureDate"
              value={formData.manufactureDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Receive Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReceiveStock;