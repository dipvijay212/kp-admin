import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import MultiProductForm from '../components/MultiProductForm';
import { addProduct, bulkAddProducts } from '../services/firestoreService';
import { PackagePlus } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('single'); // 'single' | 'multiple'

  const handleSubmitSingle = async (formData) => {
    try {
      setIsLoading(true);
      await addProduct(formData);
      navigate('/products');
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitMultiple = async (productsList) => {
    try {
      setIsLoading(true);
      await bulkAddProducts(productsList);
      navigate('/products');
    } catch (error) {
      console.error("Error adding products:", error);
      alert("Failed to add products.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <PackagePlus className="text-primary w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Products</h1>
            <p className="text-gray-500 text-sm mt-1">Create new products for the catalog</p>
          </div>
        </div>

        <div className="bg-gray-100/80 p-1 rounded-lg inline-flex gap-1 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              mode === 'single'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Single Product
          </button>
          <button
            type="button"
            onClick={() => setMode('multiple')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              mode === 'multiple'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Multiple Products
          </button>
        </div>
      </div>

      {mode === 'single' ? (
        <ProductForm onSubmit={handleSubmitSingle} isLoading={isLoading} />
      ) : (
        <MultiProductForm onSubmit={handleSubmitMultiple} isLoading={isLoading} />
      )}
    </div>
  );
};

export default AddProduct;
