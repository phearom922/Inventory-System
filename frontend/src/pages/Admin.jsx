import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaEdit, FaUsers, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import axios from 'axios'; // ใช้ axios แทน services ถ้าต้องการ

function Admin() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
    branchId: []
  });
  const [branches, setBranches] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get('/api/branches', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBranches(response.data.map(branch => ({
        value: branch._id,
        label: `${branch.branchId} - ${branch.name}`
      })));
    } catch (err) {
      toast.error('Failed to fetch branches');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBranchChange = (selectedOptions) => {
    setFormData({ ...formData, branchId: selectedOptions.map(option => option.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validBranchIds = ['PNH01', 'KCM01'];
    const branchIds = branches.filter(b => formData.branchId.includes(b.value)).map(b => b.branchId);
    if (branchIds.some(id => !validBranchIds.includes(id))) {
      toast.error('Invalid Branch ID. Use PNH01 or KCM01 only.');
      return;
    }

    try {
      const url = editUserId ? `/api/users/${editUserId}` : '/api/users';
      const method = editUserId ? 'put' : 'post';
      const data = { ...formData, branchId: formData.branchId };
      if (!editUserId) data.password = formData.password; // ส่ง password เฉพาะตอนสร้าง
      await axios[method](url, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`User ${editUserId ? 'updated' : 'created'} successfully`);
      setFormData({ username: '', password: '', role: 'user', branchId: [] });
      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      toast.error(`Failed to ${editUserId ? 'update' : 'create'} user: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
      branchId: user.branchId
    });
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('User deleted successfully');
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        toast.error(`Failed to delete user: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  if (loading) return <div className="text-center p-4 text-blue-600">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
        <FaUsers className="mr-2" /> User Management
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
          {editUserId ? <><FaEdit className="mr-2" /> Edit User</> : <><FaUserPlus className="mr-2" /> Create User</>}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-600 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!editUserId}
            />
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Branch</label>
            <Select
              isMulti={formData.role === 'admin'}
              options={branches}
              value={branches.filter(branch => formData.branchId.includes(branch.value))}
              onChange={handleBranchChange}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editUserId ? 'Update User' : 'Create User'}
            </button>
            {editUserId && (
              <button
                type="button"
                onClick={() => {
                  setEditUserId(null);
                  setFormData({ username: '', password: '', role: 'user', branchId: [] });
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
        <h2 className="text-lg font-semibold text-blue-600 mb-4">User List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="border p-2 text-left">Username</th>
              <th className="border p-2 text-left">Role</th>
              <th className="border p-2 text-left">Branch</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="hover:bg-blue-50">
                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  {user.branchId.map(id => branches.find(b => b.value === id)?.label || 'Unknown').join(', ') || 'N/A'}
                </td>
                <td className="border p-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
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

export default Admin;