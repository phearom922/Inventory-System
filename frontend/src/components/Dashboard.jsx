import { useEffect, useState } from 'react';
  import { getProducts, getLots, getWasteRecords, getWarehouses } from '../services/api';
  import ReportTable from './ReportTable';
  import { FaBox, FaWarehouse, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
  import { Pie, Bar, Line } from 'react-chartjs-2';
  import { Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
  import { useAuth } from '../context/AuthContext';

  ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

  function Dashboard() {
    const auth = useAuth();
    const branchFilter = auth ? auth.branchFilter : []; // ตรวจสอบค่า default

    const [products, setProducts] = useState([]);
    const [lots, setLots] = useState([]);
    const [waste, setWaste] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [productRes, lotRes, wasteRes, warehouseRes] = await Promise.all([
            getProducts({ branchId: branchFilter }),
            getLots({ branchId: branchFilter }),
            getWasteRecords({ branchId: branchFilter }),
            getWarehouses({ branchId: branchFilter })
          ]);
          setProducts(productRes.data);
          setLots(lotRes.data);
          setWaste(wasteRes.data.slice(0, 5));
          setWarehouses(warehouseRes.data);

          const notifications = [];
          lotRes.data.forEach(lot => {
            const expiryThreshold = new Date();
            expiryThreshold.setDate(expiryThreshold.getDate() + 30);
            if (lot.expiryDate <= expiryThreshold) {
              notifications.push({
                type: 'expiry',
                message: `Lot ${lot.lotId} of ${lot.productId.name} expires on ${new Date(lot.expiryDate).toLocaleDateString()}`
              });
            }
            if (lot.quantity <= lot.productId.minimumStock) {
              notifications.push({
                type: 'lowStock',
                message: `Lot ${lot.lotId} has ${lot.quantity} units, below minimum ${lot.productId.minimumStock}`
              });
            }
          });
          setNotifications(notifications);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          setLoading(false);
        }
      };
      fetchData();
    }, [branchFilter]);

    if (loading) return <div className="text-center p-4 text-blue-600">Loading...</div>;

    const stockByBranch = warehouses.reduce((acc, wh) => {
      const branchStock = lots
        .filter(lot => lot.warehouseId.toString() === wh._id.toString())
        .reduce((sum, lot) => sum + lot.quantity, 0);
      acc[wh.branchId] = (acc[wh.branchId] || 0) + branchStock;
      return acc;
    }, {});

    const topProducts = lots.sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    const pieData = {
      labels: Object.keys(stockByBranch),
      datasets: [
        {
          data: Object.values(stockByBranch),
          backgroundColor: ['#2563EB', '#1E40AF', '#60A5FA', '#93C5FD', '#DBEAFE'],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };

    const wasteByDate = waste.reduce((acc, w) => {
      const date = new Date(w.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + w.quantity;
      return acc;
    }, {});

    const barData = {
      labels: Object.keys(wasteByDate),
      datasets: [
        {
          label: 'Waste Quantity',
          data: Object.values(wasteByDate),
          backgroundColor: '#EF4444',
          borderColor: '#B91C1C',
          borderWidth: 1,
        },
      ],
    };

    const stockTrend = lots.reduce((acc, lot) => {
      const date = new Date(lot.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + lot.quantity;
      return acc;
    }, {});

    const lineData = {
      labels: Object.keys(stockTrend),
      datasets: [
        {
          label: 'Stock Trend',
          data: Object.values(stockTrend),
          fill: false,
          borderColor: '#2563EB',
          tension: 0.1,
        },
      ],
    };

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
          <FaBox className="mr-2" /> Stock Dashboard
        </h1>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="bg-yellow-100 p-4 mb-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-yellow-800 flex items-center">
              <FaExclamationTriangle className="mr-2" /> Notifications
            </h2>
            <ul className="list-disc pl-5 mt-2">
              {notifications.map((notif, index) => (
                <li key={index} className="text-yellow-700">{notif.message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center">
              <FaBox className="mr-2" /> Total Products
            </h2>
            <p className="text-2xl font-bold text-blue-800">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center">
              <FaWarehouse className="mr-2" /> Total Warehouses
            </h2>
            <p className="text-2xl font-bold text-blue-800">{warehouses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center">
              <FaExclamationTriangle className="mr-2" /> Lots Nearing Expiry
            </h2>
            <p className="text-2xl font-bold text-blue-800">
              {lots.filter(lot => new Date(lot.expiryDate) <= new Date().setDate(new Date().getDate() + 30)).length}
            </p>
          </div>
        </div>

        {/* Stock by Branch - Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Stock by Branch</h2>
          <div className="h-64">
            <Pie
              data={pieData}
              options={{
                plugins: {
                  legend: { position: 'right' },
                  tooltip: { backgroundColor: '#2563EB' },
                },
              }}
            />
          </div>
        </div>

        {/* Waste by Date - Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
            <FaTrash className="mr-2" /> Waste by Date
          </h2>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                scales: {
                  y: { beginAtZero: true },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: { backgroundColor: '#B91C1C' },
                },
              }}
            />
          </div>
        </div>

        {/* Stock Trend - Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
            <FaBox className="mr-2" /> Stock Trend
          </h2>
          <div className="h-64">
            <Line
              data={lineData}
              options={{
                scales: {
                  y: { beginAtZero: true },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: { backgroundColor: '#2563EB' },
                },
              }}
            />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
            <FaBox className="mr-2" /> Top 5 Products by Stock
          </h2>
          <ReportTable
            data={topProducts}
            columns={[
              { header: 'SKU', accessor: 'productId.sku' },
              { header: 'Name', accessor: 'productId.name' },
              { header: 'Quantity', accessor: 'quantity' }
            ]}
          />
        </div>

        {/* Recent Waste Records */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
            <FaTrash className="mr-2" /> Recent Waste Records
          </h2>
          <ReportTable
            data={waste}
            columns={[
              { header: 'SKU', accessor: 'lotId.productId.sku' },
              { header: 'Lot ID', accessor: 'lotId.lotId' },
              { header: 'Quantity', accessor: 'quantity' },
              { header: 'Reason', accessor: 'reason' },
              { header: 'Date', accessor: row => new Date(row.date).toLocaleDateString() }
            ]}
          />
        </div>
      </div>
    );
  }

  export default Dashboard;