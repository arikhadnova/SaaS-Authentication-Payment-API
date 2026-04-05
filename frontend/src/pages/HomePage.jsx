import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          🚀 Production-ready SaaS Backend
        </span>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Authentication & Payment
          <span className="text-blue-600"> Made Simple</span>
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">
          A full-featured SaaS boilerplate with JWT auth, OAuth login,
          and payment gateway integration. Ready to scale.
        </p>
        <div className="flex justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Everything you need to launch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🔐',
                title: 'Auth System',
                desc: 'JWT authentication with refresh tokens, bcrypt password hashing, and protected routes.'
              },
              {
                icon: '🌐',
                title: 'OAuth Login',
                desc: 'Login with Google and GitHub via Passport.js. Account linking support included.'
              },
              {
                icon: '💳',
                title: 'Payment Gateway',
                desc: 'Midtrans integration with webhook handling and automatic transaction status updates.'
              },
              {
                icon: '🗄️',
                title: 'PostgreSQL + Prisma',
                desc: 'Type-safe database access with Prisma ORM. Migration-based schema management.'
              },
              {
                icon: '⚡',
                title: 'RESTful API',
                desc: 'Clean, well-structured REST API following industry best practices.'
              },
              {
                icon: '🚀',
                title: 'Production Ready',
                desc: 'Scalable architecture with proper error handling, logging, and security.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to get started?
        </h2>
        <p className="text-gray-500 mb-8">
          Join thousands of developers building with our platform.
        </p>
        <Link
          to={user ? '/products' : '/register'}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {user ? 'Browse Plans →' : 'Start Building Free'}
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          © 2026 SaaS Platform. Built with Node.js, Express, PostgreSQL & React.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;