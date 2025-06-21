import { useState, useEffect } from 'react';
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '../services/api';
import { FaWarehouse, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function WarehouseManagement() {
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    _id: '',
    warehouseId: '',
    name: '',
    address: '', // เพิ่มฟิลด์ address
    manager: '', // เพิ่มฟิลด์ manager
    branchId: '' // เพิ่มฟิลด์ branchId
  });
  const [editWarehouseId, setEditWarehouseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await getWarehouses();
        setWarehouses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch warehouses');
        setLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editWarehouseId) {
        await updateWarehouse(editWarehouseId, formData);
        setWarehouses(warehouses.map(wh =>
          wh._id === editWarehouseId ? { ...wh, ...formData } : wh
        ));
        setEditWarehouseId(null);
      } else {
        const response = await createWarehouse(formData);
        setWarehouses([...warehouses, response.data]);
      }
      setFormData({ _id: '', warehouseId: '', name: '', address: '', manager: '', branchId: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save warehouse');
    }
  };

  const handleEdit = (warehouse) => {
    setEditWarehouseId(warehouse._id);
    setFormData({
      _id: warehouse._id,
      warehouseId: warehouse.warehouseId,
      name: warehouse.name,
      address: warehouse.address || '', // เพิ่มการจัดการ address
      manager: warehouse.manager || '', // เพิ่มการจัดการ manager
      branchId: warehouse.branchId || '' // เพิ่มการจัดการ branchId
    });
  };

  const handleDelete = async (warehouseId) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await deleteWarehouse(warehouseId);
        setWarehouses(warehouses.filter(wh => wh._id !== warehouseId));
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete warehouse');
      }
    }
  };

  if (loading) return <div className="text-center p-4 text-blue-600">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
        <FaWarehouse className="mr-2" /> Warehouse Management
      </h1>

      {/* Form สร้าง/แก้ไข Warehouse */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
          {editWarehouseId ? <><FaEdit className="mr-2" /> Edit Warehouse</> : <><FaPlus className="mr-2" /> Create Warehouse</>}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-blue-600 mb-1">Warehouse ID</label>
            <input
              type="text"
              name="warehouseId"
              value={formData.warehouseId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Manager</label>
            <input
              type="text"
              name="manager"
              value={formData.manager}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
            />
          </div>
          <div className="md:col-span-5">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editWarehouseId ? 'Update Warehouse' : 'Create Warehouse'}
            </button>
            {editWarehouseId && (
              <button
                type="button"
                onClick={() => {
                  setEditWarehouseId(null);
                  setFormData({ _id: '', warehouseId: '', name: '', address: '', manager: '', branchId: '' });
                }}
                className="ml-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* รายการคลังสินค้า */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Warehouse List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="border p-2 text-left">Warehouse ID</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Address</th>
              <th className="border p-2 text-left">Manager</th>
              <th className="border p-2 text-left">Branch ID</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map(warehouse => (
              <tr key={warehouse._id} className="hover:bg-blue-50">
                <td className="border p-2">{warehouse.warehouseId}</td>
                <td className="border p-2">{warehouse.name}</td>
                <td className="border p-2">{warehouse.address || 'N/A'}</td>
                <td className="border p-2">{warehouse.manager || 'N/A'}</td>
                <td className="border p-2">{warehouse.branchId || 'N/A'}</td>
                <td className="border p-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(warehouse)}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(warehouse._id)}
                    className="text-red-600 hover:underline flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WarehouseManagement;