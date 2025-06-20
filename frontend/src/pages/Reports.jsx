import { useState, useEffect} from 'react';
import { getLots, getWasteRecords, getTransactions } from '../services/api';
import ReportTable from '../components/ReportTable';
import * as XLSX from 'xlsx';

function Reports() {
  const [reportType, setReportType] = useState('stock');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (reportType === 'stock') {
          response = await getLots();
        } else if (reportType === 'waste') {
          response = await getWasteRecords();
        } else {
          response = await getTransactions();
        }
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [reportType]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType);
    XLSX.writeFile(wb, `${reportType}_report.xlsx`);
  };

  const columns = {
    stock: [
      { header: 'SKU', accessor: 'productId.sku' },
      { header: 'Name', accessor: 'productId.name' },
      { header: 'Quantity', accessor: 'quantity' },
      { header: 'Expiry Date', accessor: row => new Date(row.expiryDate).toLocaleDateString() },
      { header: 'Warehouse', accessor: 'warehouseId.name' },
      { header: 'Branch', accessor: 'branchId' }
    ],
    waste: [
      { header: 'SKU', accessor: 'lotId.productId.sku' },
      { header: 'Lot ID', accessor: 'lotId.lotId' },
      { header: 'Quantity', accessor: 'quantity' },
      { header: 'Reason', accessor: 'reason' },
      { header: 'Date', accessor: row => new Date(row.date).toLocaleDateString() }
    ],
    transactions: [
      { header: 'Type', accessor: 'type' },
      { header: 'Lot ID', accessor: 'lotId.lotId' },
      { header: 'Quantity', accessor: 'quantity' },
      { header: 'User', accessor: 'userId.username' },
      { header: 'Warehouse', accessor: 'warehouseId.name' },
      { header: 'Date', accessor: row => new Date(row.date).toLocaleDateString() }
    ]
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Reports</h1>
      <div className="mb-4">
        <button
          onClick={() => setReportType('stock')}
          className={`mr-2 p-2 rounded ${reportType === 'stock' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Stock Report
        </button>
        <button
          onClick={() => setReportType('waste')}
          className={`mr-2 p-2 rounded ${reportType === 'waste' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Waste Report
        </button>
        <button
          onClick={() => setReportType('transactions')}
          className={`p-2 rounded ${reportType === 'transactions' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Transaction Report
        </button>
        <button
          onClick={handleExport}
          className="p-2 bg-green-600 text-white rounded"
        >
          Export to Excel
        </button>
      </div>
      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <ReportTable data={data} columns={columns[reportType]} />
      )}
    </div>
  );
}

export default Reports;