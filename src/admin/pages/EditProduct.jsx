import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
  });

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await adminApi.get(`/products/${id}`);

        setProduct({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          stockQuantity: data.stockQuantity || "",
        });

        setExistingImages(data.images || []);
      } catch (error) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= IMAGE HANDLERS ================= */
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + existingImages.length > 5) {
      toast.error("Maximum 5 images allowed per product");
      return;
    }

    setNewImages(files);
  };

  const removeExistingImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await adminApi.delete(`/products/${id}/images/${imageId}`);
      setExistingImages(existingImages.filter(img => img._id !== imageId));
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!product.name || !product.description || !product.price) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", Number(product.price));
      formData.append("stockQuantity", Number(product.stockQuantity));

      // 🔥 MUST BE "images"
      newImages.forEach((img) => {
        formData.append("images", img);
      });

      await adminApi.put(`/products/${id}`, formData);

      toast.success("✅ Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-[#2F4F3E] mb-6">
        Edit Product
      </h2>

      {loading && <p className="text-gray-500 mb-3">Loading...</p>}

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          placeholder="Product Name"
          value={product.name}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          rows="4"
          placeholder="Product Description"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Stock Quantity"
          value={product.stockQuantity}
          onChange={(e) =>
            setProduct({ ...product, stockQuantity: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
        />

        {/* EXISTING IMAGES */}
        {existingImages.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Existing Images</p>
            <div className="flex gap-3 flex-wrap">
              {existingImages.map((img) => (
                <div key={img._id} className="relative">
                  <img
                    src={img.url}
                    alt="product"
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img._id)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEW IMAGES */}
        <div>
          <p className="text-sm text-gray-600 mb-1">
            Add New Images (optional)
          </p>
          <input type="file" multiple accept="image/*" onChange={handleNewImages} />
        </div>

        {newImages.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {newImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2F4F3E] text-white py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
