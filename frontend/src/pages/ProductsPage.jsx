import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    paymentService.getProducts()
      .then(res => setProducts(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleBuy = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBuyingId(productId);
    try {
      const res = await paymentService.createTransaction(productId);
      const { snapUrl } = res.data.data;

      // Redirect ke halaman pembayaran Midtrans
      window.location.href = snapUrl;
    } catch (err) {
      console.error(err);
      alert('Failed to create transaction. Please try again.');
    } finally {
      setBuyingId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const planFeatures = {
    'Starter Plan': [
      '1 user',
      '5 projects',
      'Basic analytics',
      'Email support',
    ],
    'Pro Plan': [
      '5 users',
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'Custom domain',
    ],
    'Enterprise Plan': [
      'Unlimited users',
      'Unlimited projects',
      'Full analytics suite',
      '24/7 dedicated support',
      'Custom domain',
      'SLA guarantee',
    ],
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">Loading plans...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Choose Your Plan
        </h1>
        <p className="text-gray-500 text-lg">
          Start free, scale as you grow
        </p>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const isPopular = index === 1;
          const features = planFeatures[product.name] || [];

          return (
            <div
              key={product.id}
              className={`relative bg-white rounded-2xl border p-6 flex flex-col ${
                isPopular
                  ? 'border-blue-500 shadow-lg shadow-blue-100'
                  : 'border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {product.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {product.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-800">
                  {formatPrice(product.price)}
                </span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-8 flex-1">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleBuy(product.id)}
                disabled={buyingId === product.id}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
                  isPopular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {buyingId === product.id ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;