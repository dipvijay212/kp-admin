import React, { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Search, FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import ProductTable from '../components/ProductTable';
import { getProducts, deleteProduct, bulkAddProducts } from '../services/firestoreService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        setIsDeleting(true);
        await deleteProduct(product.id);
        setProducts(products.filter(p => p.id !== product.id));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        // Map data based on columns
        const formattedProducts = data.map(item => ({
          name: item.name || '',
          category: item.category || '',
          image: item.image || '',
        })).filter(p => p.name); // Filter out rows without name

        if (formattedProducts.length > 0) {
          if (window.confirm(`Found ${formattedProducts.length} products. Proceed with upload?`)) {
            await bulkAddProducts(formattedProducts);
            alert("Bulk upload successful!");
            fetchProducts();
          }
        } else {
          alert("No valid products found in the Excel file. Please check columns.");
        }
      } catch (error) {
        console.error("Error parsing Excel:", error);
        alert("Failed to read Excel file. Please ensure columns match the required format.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your catalog items</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            {isUploading ? <Upload className="w-5 h-5 animate-bounce" /> : <FileDown className="w-5 h-5 text-gray-500" />}
            {isUploading ? 'Uploading...' : 'Bulk Import'}
          </button>
          
          <Link
            to="/products/add"
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-[#081650] text-white font-medium rounded-lg transition-colors shadow-md shadow-primary/20"
          >
            <Plus className="w-5 h-5" /> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Search className="text-gray-400 w-5 h-5 ml-2" />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-gray-700"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ProductTable products={filteredProducts} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ProductList;
