import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { FaBox, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function ProductManagement({ branchFilter = [] }) { // รับ branchFilter จาก props
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        sku: '',
        minimumStock: 0,
        unit: '',
        category: ''
    });
    const [editProductId, setEditProductId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts({ branchId: branchFilter });
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };
        fetchProducts();
    }, [branchFilter]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = { ...formData, branchId: branchFilter }; // เพิ่ม branchId
            if (editProductId) {
                await updateProduct(editProductId, dataToSend);
                setProducts(products.map(prod =>
                    prod._id === editProductId ? { ...prod, ...dataToSend } : prod
                ));
                setEditProductId(null);
            } else {
                const response = await createProduct(dataToSend);
                setProducts([...products, response.data]);
            }
            setFormData({ _id: '', name: '', sku: '', minimumStock: 0, unit: '', category: '' });
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
        }
    };

    const handleEdit = (product) => {
        setEditProductId(product._id);
        setFormData({
            _id: product._id,
            name: product.name,
            sku: product.sku,
            minimumStock: product.minimumStock,
            unit: product.unit || '',
            category: product.category || ''
        });
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
                setProducts(products.filter(prod => prod._id !== productId));
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    if (loading) return <div className="text-center p-4 text-blue-600">Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
                <FaBox className="mr-2" /> Product Management
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                    {editProductId ? <><FaEdit className="mr-2" /> Edit Product</> : <><FaPlus className="mr-2" /> Create Product</>}
                </h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-blue-600 mb-1">Product Name</label>
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
                        <label className="block text-blue-600 mb-1">SKU</label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-blue-600 mb-1">Minimum Stock</label>
                        <input
                            type="number"
                            name="minimumStock"
                            value={formData.minimumStock}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-blue-600 mb-1">Unit</label>
                        <input
                            type="text"
                            name="unit"
                            value={formData.unit}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g., pcs, kg"
                        />
                    </div>
                    <div>
                        <label className="block text-blue-600 mb-1">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g., Electronics, Food"
                        />
                    </div>
                    <div className="md:col-span-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                            {editProductId ? 'Update Product' : 'Create Product'}
                        </button>
                        {editProductId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditProductId(null);
                                    setFormData({ _id: '', name: '', sku: '', minimumStock: 0, unit: '', category: '' });
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
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Product List</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="border p-2 text-left">Name</th>
                            <th className="border p-2 text-left">SKU</th>
                            <th className="border p-2 text-left">Minimum Stock</th>
                            <th className="border p-2 text-left">Unit</th>
                            <th className="border p-2 text-left">Category</th>
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} className="hover:bg-blue-50">
                                <td className="border p-2">{product.name}</td>
                                <td className="border p-2">{product.sku}</td>
                                <td className="border p-2">{product.minimumStock}</td>
                                <td className="border p-2">{product.unit || 'N/A'}</td>
                                <td className="border p-2">{product.category || 'N/A'}</td>
                                <td className="border p-2 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="text-blue-600 hover:underline flex items-center"
                                    >
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
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

export default ProductManagement;