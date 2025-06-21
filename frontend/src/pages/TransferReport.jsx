import { useState, useEffect } from 'react';
import { getTransactions, getWarehouses } from '../services/api';
import { FaExchangeAlt, FaFilter, FaFileExcel } from 'react-icons/fa';
import ReportTable from '../components/ReportTable';
import * as XLSX from 'xlsx';

function TransferReport() {
  const [transactions, setTransactions] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filters, setFilters] = useState({
    fromWarehouseId: '',
    toWarehouseId: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, whRes] = await Promise.all([getTransactions(), getWarehouses()]);
        setTransactions(transRes.data.filter(t => t.type === 'transfer'));
        setWarehouses(whRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch transfer data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredTransactions = transactions.filter(t => {
    const fromMatch = !filters.fromWarehouseId || t.fromWarehouseId?._id === filters.fromWarehouseId;
    const toMatch = !filters.toWarehouseId || t.toWarehouseId?._id === filters.toWarehouseId;
    const date = new Date(t.date);
    const startDateMatch = !filters.startDate || date >= new Date(filters.startDate);
    const endDateMatch = !filters.endDate || date <= new Date(filters.endDate);
    return fromMatch && toMatch && startDateMatch && endDateMatch;
  });

  const handleExportExcel = () => {
    // เตรียมข้อมูลสำหรับ Excel
    const exportData = filteredTransactions.map(t => ({
      'Lot ID': t.lotId?.lotId || 'N/A',
      'Product': t.lotId?.productId?.name || 'N/A',
      'Quantity': t.quantity || 0,
      'From Warehouse': t.fromWarehouseId?.name || 'N/A',
      'To Warehouse': t.toWarehouseId?.name || 'N/A',
      'Date': t.date ? new Date(t.date).toLocaleDateString() : 'N/A'
    }));

    // สร้าง worksheet และ workbook
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transfer Report');

    // ตั้งค่าความกว้างคอลัมน์
    ws['!cols'] = [
      { wch: 15 }, // Lot ID
      { wch: 20 }, // Product
      { wch: 10 }, // Quantity
      { wch: 20 }, // From Warehouse
      { wch: 20 }, // To Warehouse
      { wch: 15 }  // Date
    ];

    // สร้างไฟล์ Excel และดาวน์โหลด
    XLSX.write(wb, `Transfer_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading) return <div className="text-center p-4 text-blue-600">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800 flex items-center">
          <FaExchangeAlt className="mr-2" /> Transfer Report
        </h1>
        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 flex items-center"
        >
          <FaFileExcel className="mr-2" /> Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
          <FaFilter className="mr-2" /> Filters
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-blue-600 mb-1">From Warehouse</label>
            <select
              name="fromWarehouseId"
              value={filters.fromWarehouseId}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {warehouses.map(wh => (
                <option key={wh._id} value={wh._id}>{wh.name} ({wh.warehouseId})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-blue-600 mb-1">To Warehouse</label>
            <select
              name="toWarehouseId"
              value={filters.toWarehouseId}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {warehouses.map(wh => (
                <option key={wh._id} value={wh._id}>{wh.name} ({wh.warehouseId})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-blue-600 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-blue-600 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Transfer Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Transfer Records</h2>
        <ReportTable
          data={filteredTransactions}
          columns={[
            { header: 'Lot ID', accessor: 'lotId.lotId' },
            { header: 'Product', accessor: 'lotId.productId.name' },
            { header: 'Quantity', accessor: 'quantity' },
            { header: 'From Warehouse', accessor: 'fromWarehouseId.name' },
            { header: 'To Warehouse', accessor: 'toWarehouseId.name' },
            { header: 'Date', accessor: row => new Date(row.date).toLocaleDateString() }
          ]}
        />
      </div>
    </div>
  );
}

export default TransferReport;