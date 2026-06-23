import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { getProductById, updateProduct } from '../services/firestoreService';
import { PenTool } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);
        if (product) {
          setInitialData(product);
        } else {
          alert('Product not found');
          navigate('/products');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      // Remove id from formData before updating
      const { id: _, ...updateData } = formData;
      await updateProduct(id, updateData);
      navigate('/products');
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <PenTool className="text-primary w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-500 text-sm mt-1">Update details for {initialData?.name}</p>
        </div>
      </div>

      <ProductForm initialData={initialData} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default EditProduct;
