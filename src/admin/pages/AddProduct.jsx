import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    weight: "",
    stockQuantity: "",
    description: "",
  });

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

    setImages(files);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!product.category) {
      toast.error("Please select a category");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
      formData.append(key, value);
    });

    images.forEach((img) => {
      formData.append("images", img); // 🔥 MUST BE "images"
    });

    try {
      setLoading(true);

      await adminApi.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Product add failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold text-[#2F4F3E] mb-6">
        Add New Product
      </h1>

      <form onSubmit={submitHandler} className="space-y-4">

        <input
          required
          placeholder="Product Name"
          value={product.name}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
        />

        {/* CATEGORY (DYNAMIC) */}
        <select
          required
          value={product.category}
          onChange={(e) =>
            setProduct({ ...product, category: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">
            {loadingCategories ? "Loading categories..." : "Select Category"}
          </option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace("-", " ").toUpperCase()}
            </option>
          ))}
        </select>

        <input
          required
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
        />

        <input
          required
          placeholder="Weight (500g, 1kg)"
          value={product.weight}
          onChange={(e) =>
            setProduct({ ...product, weight: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
        />

        <input
          required
          type="number"
          placeholder="Stock Quantity"
          value={product.stockQuantity}
          onChange={(e) =>
            setProduct({
              ...product,
              stockQuantity: e.target.value,
            })
          }
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          required
          rows="4"
          placeholder="Product Description"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
        />

        {/* IMAGE UPLOAD */}
        <div>
          <p className="text-sm text-gray-600 mb-1">
            Upload Images (max 5)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={imageHandler}
          />
        </div>

        {/* PREVIEW */}
        {images.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-[#2F4F3E] text-white py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
