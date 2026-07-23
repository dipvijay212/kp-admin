import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Upload, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/firestoreService';
import { uploadImageToCloudinary } from '../services/cloudinaryService';

const MultiProductForm = ({ onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCats();
  }, []);

  const handleBulkFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      const tempId = Math.random().toString(36).substring(2, 11);
      
      // Append a new row in uploading state
      setRows(prev => [...prev, {
        id: tempId,
        name: '',
        category: '',
        image: '',
        isUploading: true,
        fileName: file.name,
        uploadFailed: false
      }]);

      // Start upload
      uploadImageToCloudinary(file)
        .then(url => {
          setRows(prev => prev.map(row => 
            row.id === tempId 
              ? { ...row, image: url, isUploading: false }
              : row
          ));
        })
        .catch(err => {
          console.error("Error uploading image:", err);
          setRows(prev => prev.map(row => 
            row.id === tempId 
              ? { ...row, isUploading: false, uploadFailed: true }
              : row
          ));
        });
    });

    // Reset file input
    e.target.value = '';
  };

  const handleAddBlankRow = () => {
    const tempId = Math.random().toString(36).substring(2, 11);
    setRows(prev => [...prev, {
      id: tempId,
      name: '',
      category: '',
      image: '',
      isUploading: false,
      fileName: '',
      uploadFailed: false
    }]);
  };

  const handleRemoveRow = (id) => {
    setRows(prev => prev.filter(row => row.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleRowFileChange = async (id, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setRows(prev => prev.map(row => row.id === id ? { ...row, isUploading: true, uploadFailed: false, fileName: file.name } : row));
    try {
      const url = await uploadImageToCloudinary(file);
      setRows(prev => prev.map(row => row.id === id ? { ...row, image: url, isUploading: false } : row));
    } catch (error) {
      console.error("Row upload failed:", error);
      setRows(prev => prev.map(row => row.id === id ? { ...row, isUploading: false, uploadFailed: true } : row));
    }
  };

  const handleRemoveImage = (id) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, image: '', fileName: '' } : row));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Filter out completely blank rows
    const validProducts = rows
      .map(row => ({
        name: row.name.trim(),
        category: row.category.trim(),
        image: row.image
      }))
      .filter(p => p.name || p.category || p.image);

    if (validProducts.length === 0) {
      alert("Please upload images or enter details for at least one product before saving.");
      return;
    }

    if (rows.some(row => row.isUploading)) {
      alert("Please wait for all image uploads to finish before saving.");
      return;
    }

    onSubmit(validProducts);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Bulk Upload Section */}
      <div className="mb-6 p-6 border-2 border-dashed border-gray-300 hover:border-primary rounded-xl bg-gray-50/50 flex flex-col items-center justify-center transition-colors cursor-pointer relative group">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleBulkFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="w-10 h-10 text-gray-400 group-hover:text-primary mb-3 transition-colors" />
        <h3 className="font-semibold text-gray-700 group-hover:text-primary transition-colors">Bulk Image Upload</h3>
        <p className="text-xs text-gray-500 mt-1 text-center max-w-md">
          Select multiple product images from your device. A separate editable row will be created automatically for each image.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {rows.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium">No products added yet</p>
            <p className="text-sm text-gray-400 mt-1">Upload images above or click "Add Row" below to start entering products manually.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 w-12 text-center">#</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 w-32">Image</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Product Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Category</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, index) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-500 font-medium text-center">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4">
                      {row.image ? (
                        <div className="relative w-16 h-16 rounded border bg-gray-50 flex items-center justify-center group overflow-hidden">
                          <img src={row.image} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(row.id)}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className={`flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed ${row.uploadFailed ? 'border-red-300 bg-red-50/50' : 'border-gray-300 bg-gray-50'} rounded cursor-pointer hover:bg-gray-100 transition-colors relative`}>
                          {row.isUploading ? (
                            <div className="flex flex-col items-center justify-center">
                              <Loader2 className="w-5 h-5 text-primary animate-spin" />
                              <span className="text-[8px] text-gray-500 mt-1 truncate max-w-[60px]">{row.fileName}</span>
                            </div>
                          ) : row.uploadFailed ? (
                            <div className="flex flex-col items-center justify-center text-red-500" title="Upload failed. Click to retry.">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-[9px] mt-0.5">Retry</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-gray-400" />
                              <span className="text-[10px] text-gray-500 mt-1">Upload</span>
                            </>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            disabled={row.isUploading}
                            onChange={(e) => handleRowFileChange(row.id, e)}
                          />
                        </label>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm"
                        placeholder="Product name (optional)"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <input
                        type="text"
                        list={`cats-${row.id}`}
                        value={row.category}
                        onChange={(e) => handleInputChange(row.id, 'category', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm"
                        placeholder="Category (optional)"
                      />
                      <datalist id={`cats-${row.id}`}>
                        {categories.map((cat, idx) => (
                          <option key={idx} value={cat} />
                        ))}
                      </datalist>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                        title="Remove Row"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex gap-3 justify-start">
          <button
            type="button"
            onClick={handleAddBlankRow}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-sm font-medium"
          >
            <Plus size={16} /> Add Row
          </button>
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 border-t pt-6">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X size={18} /> Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || rows.some(row => row.isUploading)}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#081650] transition-colors disabled:opacity-75 disabled:cursor-not-allowed shadow-md shadow-primary/20"
          >
            <Save size={18} /> {isLoading ? 'Saving...' : 'Save Products'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiProductForm;
