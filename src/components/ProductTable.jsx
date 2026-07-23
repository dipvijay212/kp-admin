import React from 'react';
import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductTable = ({ products, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 md:px-6 py-3 md:py-4 text-sm font-semibold text-gray-600">Image</th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-sm font-semibold text-gray-600">Category</th>

              <th className="px-3 md:px-6 py-3 md:py-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-3 md:px-6 py-6 text-center text-gray-500">
                  no products found. Add some products or check your search query.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover border" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="font-medium text-gray-900">{product.name || 'Unnamed Product'}</div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                        className="text-primary hover:text-[#081650] bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
