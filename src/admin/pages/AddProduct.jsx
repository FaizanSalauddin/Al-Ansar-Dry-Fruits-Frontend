import { useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    weight: "",
    stockQuantity: "",
    description: "",
  });

  // 📸 Image select
  const imageHandler = (e) => {
    setImages([...e.target.files]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();

    // Append product fields
    Object.keys(product).forEach((key) => {
      formData.append(key, product[key]);
    });

    // Append images
    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      setLoading(true);

      await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Product add failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

      <form onSubmit={submitHandler} className="space-y-3">
        <input
          required
          placeholder="Product Name"
          value={product.name}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />

        <input
          required
          placeholder="Category (almonds, dates, etc)"
          value={product.category}
          onChange={(e) =>
            setProduct({ ...product, category: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />

        <input
          required
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />

        <input
          required
          placeholder="Weight (500g, 1kg)"
          value={product.weight}
          onChange={(e) =>
            setProduct({ ...product, weight: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />

        <input
          required
          type="number"
          placeholder="Stock Quantity"
          value={product.stockQuantity}
          onChange={(e) =>
            setProduct({ ...product, stockQuantity: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          required
          placeholder="Description"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={imageHandler}
          className="w-full"
        />

        {/* PREVIEW */}
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-green-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
