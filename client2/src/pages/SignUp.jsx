import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useApp } from '../context/AppContext';

const SignUp = () => {
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
          <h1 className="text-3xl font-bold mb-4">Join Our Community</h1>
          <p className="text-blue-100 mb-6">
            Create an account to start donating items you no longer need or to request items you need.
          </p>
          <div className="space-y-4 mb-8">
            <h2 className="font-semibold">Why join?</h2>
            <ul className="list-disc list-inside text-blue-100 space-y-2">
              <li>Help reduce waste in your community</li>
              <li>Connect with people who need your items</li>
              <li>Request items from generous donors</li>
              <li>Track all your donations in one place</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Already have an account?</h2>
            <Link to="/signin" className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded inline-block transition-colors">
              Sign In
            </Link>
          </div>
        </div>
        
        {/* Right panel with registration form */}
        <div className="p-8 md:w-1/2">
          <AuthForm formType="register" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
