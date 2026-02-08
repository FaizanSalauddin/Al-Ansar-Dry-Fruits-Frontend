import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Upload,
  X,
  Image as ImageIcon,
  Tag,
  Package,
  DollarSign,
  Weight,
  Layers,
  FileText,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";

function AddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    weight: "",
    stockQuantity: "",
    description: "",
    brand: "",
    discount: "",
  });

  const [errors, setErrors] = useState({});

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const { data } = await adminApi.get("/products/categories");
        setCategories(data.categories || []);
      } catch (err) {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /* ================= IMAGE HANDLER ================= */
  const imageHandler = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      toast.error("You can upload maximum 5 images");
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

    setImages([...images, ...validFiles].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.category) newErrors.category = "Category is required";
    if (!product.price || parseFloat(product.price) <= 0) newErrors.price = "Valid price is required";
    if (!product.weight.trim()) newErrors.weight = "Weight is required";
    if (!product.stockQuantity || parseInt(product.stockQuantity) < 0) newErrors.stockQuantity = "Valid stock quantity is required";
    if (!product.description.trim()) newErrors.description = "Description is required";
    if (images.length === 0) newErrors.images = "At least one image is required";

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

    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
      if (value !== "") formData.append(key, value);
    });

    images.forEach((img) => {
      formData.append("images", img);
    });

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

      await adminApi.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
          Product added successfully!
        </div>
      );

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  /* ================= GENERATE SKU ================= */
  const generateSKU = () => {
    const sku = `PROD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    setProduct(prev => ({ ...prev, sku }));
  };

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
                Add New Product
              </h1>
              <p className="text-gray-500 mt-1">Fill in the details to add a new product</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Package size={20} />
              <span className="font-medium">New Product</span>
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
                  <span className="text-emerald-700 font-medium">Uploading product...</span>
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
                      required
                      placeholder="Enter product name"
                      value={product.name}
                      onChange={(e) =>
                        setProduct({ ...product, name: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
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
                    <Package size={16} />
                    Category
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={product.category}
                      onChange={(e) =>
                        setProduct({ ...product, category: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none cursor-pointer ${
                        errors.category ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">
                        {loadingCategories ? "Loading categories..." : "Select a category"}
                      </option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="capitalize">
                          {cat.replace(/-/g, " ")}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                      <ChevronDown className="text-gray-400" size={16} />
                    </div>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.category}
                      </p>
                    )}
                  </div>
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
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={product.price}
                        onChange={(e) =>
                          setProduct({ ...product, price: e.target.value })
                        }
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
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
                      required
                      placeholder="e.g., 500g, 1kg"
                      value={product.weight}
                      onChange={(e) =>
                        setProduct({ ...product, weight: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.weight ? 'border-red-300' : 'border-gray-300'
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
                      required
                      type="number"
                      min="0"
                      placeholder="Enter stock quantity"
                      value={product.stockQuantity}
                      onChange={(e) =>
                        setProduct({ ...product, stockQuantity: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.stockQuantity ? 'border-red-300' : 'border-gray-300'
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
                      required
                      rows="4"
                      placeholder="Enter product description..."
                      value={product.description}
                      onChange={(e) =>
                        setProduct({ ...product, description: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
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

               

                {/* Image Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon size={16} />
                    Product Images
                    <span className="text-xs text-gray-500 ml-auto">
                      Max 5 images • JPEG, PNG, WebP • Max 5MB each
                    </span>
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={imageHandler}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-3"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Upload className="text-emerald-500" size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          Click to upload images
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          or drag and drop
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  {errors.images && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.images}
                    </p>
                  )}

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">
                          Selected Images ({images.length}/5)
                        </p>
                        <button
                          type="button"
                          onClick={() => setImages([])}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove all
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {images.map((img, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`Preview ${i + 1}`}
                              className="w-full h-24 object-cover rounded-lg border shadow-sm group-hover:opacity-90 transition-opacity"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
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

            {/* Submit Button */}
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
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <AlertCircle size={16} />
            Tips for best results
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use high-quality product images (minimum 800×800 pixels)</li>
            <li>• Include clear and detailed product descriptions</li>
            <li>• Set accurate stock quantities to avoid overselling</li>
            <li>• Use appropriate categories for better organization</li>
            <li>• Consider adding discounts for promotional products</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Add missing ChevronDown icon
const ChevronDown = (props) => (
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
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default AddProduct;