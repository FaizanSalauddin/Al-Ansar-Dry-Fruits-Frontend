import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Layers,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Save,
  RefreshCw,
  Trash2
} from "lucide-react";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [errors, setErrors] = useState({});

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    weight: "",
    category: ""
  });

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const { data } = await adminApi.get(`/products/${id}`);

        setProduct({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          stockQuantity: data.stockQuantity || "",
          weight: data.weight || "",
          category: data.category || ""
        });

        setExistingImages(data.images || []);
      } catch (error) {
        toast.error("Failed to load product");
        navigate("/admin/products");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  /* ================= IMAGE HANDLERS ================= */
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + existingImages.length > 5) {
      toast.error("Maximum 5 images allowed per product");
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValidType) {
        toast.error(`${file.name} is not a valid image type (JPEG, PNG, WebP only)`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setNewImages([...newImages, ...validFiles]);
  };

  const removeExistingImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await adminApi.delete(`/products/${id}/images/${imageId}`);
      setExistingImages(existingImages.filter(img => img._id !== imageId));
      toast.success("Image deleted successfully");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const clearAllNewImages = () => {
    if (newImages.length === 0) return;
    if (window.confirm("Remove all new images?")) {
      setNewImages([]);
    }
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.description.trim()) newErrors.description = "Description is required";
    if (!product.price || parseFloat(product.price) <= 0) newErrors.price = "Valid price is required";
    if (!product.stockQuantity || parseInt(product.stockQuantity) < 0) newErrors.stockQuantity = "Valid stock quantity is required";
    if (!product.weight.trim()) newErrors.weight = "Weight is required";
    if (!product.category.trim()) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", Number(product.price));
      formData.append("stockQuantity", Number(product.stockQuantity));
      formData.append("weight", product.weight);
      formData.append("category", product.category);

      newImages.forEach((img) => {
        formData.append("images", img);
      });

      await adminApi.put(`/products/${id}`, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle size={20} className="text-emerald-500" />
          Product updated successfully!
        </div>
      );

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Products</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Edit Product
              </h1>
              <p className="text-gray-500 mt-1">Update product information</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Product ID: {id.slice(-8)}
                </span>
                <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {existingImages.length + newImages.length}/5 images
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <RefreshCw size={20} />
              <span className="font-medium">Edit Mode</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {loading && (
            <div className="px-6 py-4 bg-emerald-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin text-emerald-600" size={20} />
                  <span className="text-emerald-700 font-medium">Updating product...</span>
                </div>
                <span className="text-emerald-700 font-bold">{uploadProgress}%</span>
              </div>
              <div className="mt-2 h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <form onSubmit={submitHandler} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Tag size={16} />
                    Product Name
                  </label>
                  <div className="relative">
                    <input
                      placeholder="Enter product name"
                      value={product.name}
                      onChange={(e) =>
                        setProduct({ ...product, name: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    placeholder="e.g., Electronics, Clothing"
                    disabled={true}
                    value={product.category}
                    onChange={(e) =>
                      setProduct({ ...product, category: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.category ? 'border-red-300' : 'border-gray-300'
                      }`}
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Price & Weight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <DollarSign size={16} />
                      Price (₹)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₹
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={product.price}
                        onChange={(e) =>
                          setProduct({ ...product, price: e.target.value })
                        }
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.price ? 'border-red-300' : 'border-gray-300'
                          }`}
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.price}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Weight size={16} />
                      Weight
                    </label>
                    <input
                      placeholder="e.g., 500g, 1kg"
                      value={product.weight}
                      onChange={(e) =>
                        setProduct({ ...product, weight: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.weight ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    {errors.weight && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.weight}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Layers size={16} />
                    Stock Quantity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      placeholder="Enter stock quantity"
                      value={product.stockQuantity}
                      onChange={(e) =>
                        setProduct({ ...product, stockQuantity: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.stockQuantity ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    {product.stockQuantity && parseInt(product.stockQuantity) < 10 && (
                      <p className="mt-1 text-sm text-orange-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        Low stock warning
                      </p>
                    )}
                    {errors.stockQuantity && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.stockQuantity}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} />
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      rows="4"
                      placeholder="Enter product description..."
                      value={product.description}
                      onChange={(e) =>
                        setProduct({ ...product, description: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${errors.description ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {product.description.length}/500 characters
                    </div>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <ImageIcon size={16} />
                      Existing Images ({existingImages.length})
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {existingImages.map((img) => (
                        <div key={img._id} className="relative group">
                          <img
                            src={img.url}
                            alt="product"
                            className="w-full h-24 object-cover rounded-lg border shadow-sm group-hover:opacity-90 transition-opacity"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img._id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Delete image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Click the X button to delete existing images
                    </p>
                  </div>
                )}

                {/* New Images Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Upload size={16} />
                    Add New Images
                    <span className="text-xs text-gray-500 ml-auto">
                      Max {5 - existingImages.length} images • Max 5MB each
                    </span>
                  </label>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleNewImages}
                      className="hidden"
                      id="new-image-upload"
                      disabled={existingImages.length >= 5}
                    />
                    <label
                      htmlFor="new-image-upload"
                      className={`cursor-pointer flex flex-col items-center justify-center gap-3 ${existingImages.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Upload className="text-emerald-500" size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          {existingImages.length >= 5
                            ? 'Maximum images reached'
                            : 'Click to upload new images'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {existingImages.length >= 5
                            ? 'Delete some existing images first'
                            : 'or drag and drop'}
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* New Images Preview */}
                  {newImages.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">
                          New Images ({newImages.length})
                        </p>
                        <button
                          type="button"
                          onClick={clearAllNewImages}
                          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Remove all
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {newImages.map((img, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`New ${i + 1}`}
                              className="w-full h-24 object-cover rounded-lg border shadow-sm group-hover:opacity-90 transition-opacity"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(i)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X size={14} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 rounded-b-lg truncate">
                              {(img.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Update Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <AlertCircle size={16} />
            Update Information
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Existing images can be deleted but will be permanently removed</li>
            <li>• New images will be added to the existing ones</li>
            <li>• Maximum 5 images total allowed per product</li>
            <li>• Stock quantity updates will reflect immediately</li>
            <li>• Price changes will affect existing listings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Add missing Weight icon
const Weight = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="5" r="3" />
    <path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z" />
  </svg>
);

export default EditProduct;