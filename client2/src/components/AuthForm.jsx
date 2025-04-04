import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const AuthForm = ({ formType = 'login' }) => {
  const navigate = useNavigate();
  const { login, register, error, clearError } = useApp();
  const [userType, setUserType] = useState('donor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    address: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user types
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      if (formType === 'login') {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Registration
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          phone: formData.phone
        }, userType);
      }
      
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the context
      console.error('Authentication error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        {formType === 'login' ? 'Sign In' : 'Create Account'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span>{error}</span>
          <button 
            className="float-right font-bold"
            onClick={clearError}
          >
            &times;
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {formType === 'register' && (
          <>
            {/* User Type Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                I am a:
              </label>
              <div className="flex">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 ${
                    userType === 'donor' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  } rounded-l`}
                  onClick={() => setUserType('donor')}
                >
                  Donor
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 ${
                    userType === 'receiver' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  } rounded-r`}
                  onClick={() => setUserType('receiver')}
                >
                  Receiver
                </button>
              </div>
            </div>
            
            {/* Name */}
            <div className="mb-4">
              <label 
                htmlFor="name" 
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Address */}
            <div className="mb-4">
              <label 
                htmlFor="address" 
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Phone */}
            <div className="mb-4">
              <label 
                htmlFor="phone" 
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        )}
        
        {/* Email */}
        <div className="mb-4">
          <label 
            htmlFor="email" 
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Password */}
        <div className="mb-6">
          <label 
            htmlFor="password" 
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (formType === 'login' ? 'Signing In...' : 'Creating Account...') 
            : (formType === 'login' ? 'Sign In' : 'Create Account')}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
