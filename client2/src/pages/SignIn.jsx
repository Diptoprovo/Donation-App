import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useApp } from '../context/AppContext';

const SignIn = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left panel with illustration */}
        <div className="bg-blue-600 text-white p-8 md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-blue-100 mb-6">
            Log in to access your donation dashboard, manage your items, and track your contributions.
          </p>
          <div className="mb-8">
            <h2 className="font-semibold mb-2">Don't have an account?</h2>
            <Link to="/signup" className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded inline-block transition-colors">
              Create Account
            </Link>
          </div>
        </div>
        
        {/* Right panel with login form */}
        <div className="p-8 md:w-1/2">
          <AuthForm formType="login" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
