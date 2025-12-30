import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/products/${id}`, product);
      toast.success("Product updated");
      navigate("/admin/products");
    } catch {
      toast.error("Update failed");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <form onSubmit={submitHandler} className="space-y-3">
        {Object.keys(product).map(
          (key) =>
            typeof product[key] === "string" && (
              <input
                key={key}
                value={product[key]}
                onChange={(e) =>
                  setProduct({ ...product, [key]: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
            )
        )}

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
