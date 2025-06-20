import { useState, useEffect } from 'react';
import { getLots, getWarehouses, transferStock } from '../services/api';
import { FaExchangeAlt } from 'react-icons/fa';

function TransferStock() {
  const [lots, setLots] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    lotId: '',
    quantity: '',
    fromWarehouseId: '',
    toWarehouseId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lotRes, warehouseRes] = await Promise.all([getLots(), getWarehouses()]);
        setLots(lotRes.data);
        setWarehouses(warehouseRes.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.fromWarehouseId === formData.toWarehouseId) {
      setError('Cannot transfer to the same warehouse');
      return;
    }
    try {
      await transferStock(formData);
      setSuccess('Stock transferred successfully');
      setError('');
      setFormData({ lotId: '', quantity: '', fromWarehouseId: '', toWarehouseId: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to transfer stock');
      setSuccess('');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
        <FaExchangeAlt className="mr-2" /> Transfer Stock
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Transfer Stock Form</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-600 mb-1">Select Lot</label>
            <select
              name="lotId"
              value={formData.lotId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Lot</option>
              {lots.map(lot => (
                <option key={lot._id} value={lot._id}>
                  {lot.lotId} ({lot.productId.name}, Qty: {lot.quantity})
                </option>
              ))}
            </select>
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
            <label className="block text-blue-600 mb-1">From Warehouse</label>
            <select
              name="fromWarehouseId"
              value={formData.fromWarehouseId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Warehouse</option>
              {warehouses.map(wh => (
                <option key={wh._id} value={wh._id}>{wh.name} ({wh.warehouseId})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-blue-600 mb-1">To Warehouse</label>
            <select
              name="toWarehouseId"
              value={formData.toWarehouseId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Warehouse</option>
              {warehouses.map(wh => (
                <option key={wh._id} value={wh._id}>{wh.name} ({wh.warehouseId})</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Transfer Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransferStock;