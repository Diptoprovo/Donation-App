import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const ItemUpload = () => {
  const navigate = useNavigate();
  const { error, clearError, user } = useApp();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    condition: 'new',
    category: 'clothes',
    location: ''
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Conditions and categories from the backend model
  const conditions = ['new', 'fairly used', 'needs repair'];
  const categories = ['clothes', 'shoes', 'books', 'electronics', 'accessories', 'other']

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
    if (uploadError) setUploadError(null);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // console.log(files, selectedFiles)
    // setFiles(selectedFiles);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => {
      prev.forEach(url => URL.revokeObjectURL(url));
      return newPreviews;
    });
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index]);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      setUploadError('Please fill in all required fields');
      return;
    }

    if (files.length === 0) {
      setUploadError('Please upload at least one image');
      return;
    }

    try {
      setIsSubmitting(true);

      const data = new FormData();
      data.append('name', formData.name);
      data.append('condition', formData.condition);
      data.append('category', formData.category);
      data.append('location', user.address);
      data.append('x', user.x);
      data.append('y', user.y);
      files.forEach(file => data.append('images', file));

      await axios.post('http://localhost:4000/api/item/create-item', data); // -> fix this line for process.env.VITE_SOCKET_URL

      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to upload item';
      setUploadError(message);
      console.error('Upload error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Donate an Item</h1>

        {(error || uploadError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span>{error || uploadError}</span>
            <button
              className="float-right font-bold"
              onClick={() => {
                if (error) clearError();
                if (uploadError) setUploadError(null);
              }}
            >
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-bold mb-2">Item Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Condition */}
          <div className="mb-4">
            <label htmlFor="condition" className="block text-sm font-bold mb-2">Condition *</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            >
              {conditions.map(condition => (
                <option key={condition} value={condition}>
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-bold mb-2">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-bold mb-2">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={user.address}

              // defaultValue={user.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Upload Images *</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />
              <svg className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-1 text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>

            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img src={preview} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isSubmitting ? 'Uploading...' : 'Donate Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemUpload;
