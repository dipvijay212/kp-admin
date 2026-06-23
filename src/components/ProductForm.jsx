import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import { Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/firestoreService';

const ProductForm = ({ initialData, onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: 0,
    description: '',
    image: '',
    stock: true,
  });

  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
    
    // Fetch unique categories for the autocomplete
    const fetchCategories = async () => {
      try {
        const distinctCategories = await getCategories();
        setAvailableCategories(distinctCategories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              placeholder="Enter product name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="Brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input
                type="text"
                name="category"
                list="category-options"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="Select or type category"
              />
              <datalist id="category-options">
                {availableCategories.map((cat, idx) => (
                  <option key={idx} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              placeholder="Product description..."
            ></textarea>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="stock"
              id="stock"
              checked={formData.stock}
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <label htmlFor="stock" className="text-sm font-medium text-gray-700">In Stock</label>
          </div>
        </div>

        <div>
          <ImageUploader 
            imageUrl={formData.image} 
            onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
            onImageRemoved={() => setFormData(prev => ({ ...prev, image: '' }))}
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-4 border-t pt-6">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <X size={18} /> Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#081650] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-primary/20"
        >
          <Save size={18} /> {isLoading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
