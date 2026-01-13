import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    image: null, // NEW IMAGE (optional)
    oldImage: "", // EXISTING IMAGE
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
          image: null,
          oldImage: data.images?.[0]?.url || "",
        });
      } catch (error) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= SUBMIT ================= */
  const submitHandler = async (e) => {
    e.preventDefault();

    // BASIC VALIDATION
    if (
      !product.name ||
      !product.description ||
      !product.price ||
      !product.stockQuantity
    ) {
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

      // IMAGE OPTIONAL
      if (product.image) {
        formData.append("image", product.image);
      }

      await adminApi.put(`/products/${id}`, formData);

      toast.success("✅ Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Update failed"
      );
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

      {loading && (
        <p className="text-center text-gray-500 mb-4">
          Loading...
        </p>
      )}

      <form onSubmit={submitHandler} className="space-y-4">
        {/* NAME */}
        <input
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Product Description"
          rows="4"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
        />

        {/* PRICE */}
        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
        />

        {/* STOCK */}
        <input
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

        {/* CURRENT IMAGE */}
        {product.oldImage && (
          <div>
            <p className="text-sm mb-1 text-gray-600">
              Current Image
            </p>
            <img
              src={product.oldImage}
              alt="current"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}

        {/* NEW IMAGE */}
        <div>
          <p className="text-sm mb-1 text-gray-600">
            Change Image (optional)
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProduct({
                ...product,
                image: e.target.files[0],
              })
            }
          />
        </div>

        {/* BUTTON */}
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
