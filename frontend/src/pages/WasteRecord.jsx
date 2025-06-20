import { useState, useEffect } from 'react';
import { getLots, recordWaste } from '../services/api';
import { useNavigate } from 'react-router-dom';

function WasteRecord() {
  const [lots, setLots] = useState([]);
  const [formData, setFormData] = useState({
    lotId: '',
    quantity: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const response = await getLots();
        setLots(response.data.filter(lot => lot.branchId === localStorage.getItem('branchId')));
      } catch (err) {
        setError('Error fetching lots');
      }
    };
    fetchLots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recordWaste(formData);
      navigate('/');
    } catch (err) {
      setError('Error recording waste');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Record Waste</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Lot</label>
          <select
            name="lotId"
            value={formData.lotId}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          >
            <option value="">Select Lot</option>
            {lots.map(lot => (
              <option key={lot._id} value={lot._id}>{lot.lotId} ({lot.productId.name})</option>
            ))}
          </select>
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
          <label className="block text-sm font-medium text-gray-700">Reason</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Record Waste
        </button>
      </form>
    </div>
  );
}

export default WasteRecord;