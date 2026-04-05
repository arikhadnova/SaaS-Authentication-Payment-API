import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { paymentService } from '../services/api';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentService.getHistory()
      .then(res => setTransactions(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'expired': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-8">
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-blue-100 text-sm">
          Manage your subscriptions and transactions here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-gray-500 text-sm mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-gray-500 text-sm mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-600">
            {transactions.filter(t => t.status === 'paid').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-gray-500 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {transactions.filter(t => t.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Transaction History</h2>
          <Link
            to="/products"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Buy Plan
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm mb-3">No transactions yet</p>
            <Link
              to="/products"
              className="text-blue-600 text-sm hover:underline"
            >
              Browse our plans →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map(tx => (
              <div key={tx.id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{tx.product.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {new Date(tx.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-800 text-sm font-medium">
                    Rp{tx.amount.toLocaleString('id-ID')}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;