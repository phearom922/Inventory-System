import React, { useState, useEffect } from 'react';
import { getBranches, createBranch, updateBranch, deleteBranch } from '../services/api';
import { FaBuilding, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function BranchManagement() {
  const { branchFilter } = useAuth();
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    location: ''
  });
  const [editBranchId, setEditBranchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!branchFilter || branchFilter.length === 0) {
      console.warn('[BranchManagement] Waiting for branchFilter...');
      return;
    }

    const fetchBranches = async () => {
      try {
        console.log('[BranchManagement] Fetching with:', branchFilter);
        const response = await getBranches({ branchId: branchFilter });
        setBranches(response.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch branches');
        setLoading(false);
      }
    };

    fetchBranches();
  }, [branchFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setError('Loading took too long. Check your token or branch assignment.');
        setLoading(false);
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [loading]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (editBranchId) {
        await updateBranch(editBranchId, dataToSend);
        setBranches(branches.map(branch =>
          branch._id === editBranchId ? { ...branch, ...dataToSend } : branch
        ));
        setEditBranchId(null);
      } else {
        const response = await createBranch(dataToSend);
        setBranches([...branches, response.data]);
      }
      setFormData({ _id: '', name: '', location: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save branch');
    }
  };

  const handleEdit = (branch) => {
    setEditBranchId(branch._id);
    setFormData({
      _id: branch._id,
      name: branch.name,
      location: branch.location
    });
  };

  const handleDelete = async (branchId) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await deleteBranch(branchId);
        setBranches(branches.filter(branch => branch._id !== branchId));
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete branch');
      }
    }
  };

  if (loading) return <div className="text-center p-4 text-blue-600">Loading...</div>;
console.log("Fetching products for branchId:", branchId);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
        <FaBuilding className="mr-2" /> Branch Management
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
          {editBranchId ? <><FaEdit className="mr-2" /> Edit Branch</> : <><FaPlus className="mr-2" /> Create Branch</>}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-600 mb-1">Branch Name</label>
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
            <label className="block text-blue-600 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., Phnom Penh, Cambodia"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editBranchId ? 'Update Branch' : 'Create Branch'}
            </button>
            {editBranchId && (
              <button
                type="button"
                onClick={() => {
                  setEditBranchId(null);
                  setFormData({ _id: '', name: '', location: '' });
                }}
                className="ml-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Branch List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Location</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(branch => (
              <tr key={branch._id} className="hover:bg-blue-50">
                <td className="border p-2">{branch.name}</td>
                <td className="border p-2">{branch.location}</td>
                <td className="border p-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(branch)}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(branch._id)}
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

export default BranchManagement;