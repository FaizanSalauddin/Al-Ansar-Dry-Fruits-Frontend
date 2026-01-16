import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [eta, setEta] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchOrders = async () => {
    try {
      const { data } = await adminApi.get("/orders");
      setOrders(data.orders || []);
    } catch {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= DATE HELPERS ================= */
  const today = () => new Date().toISOString().slice(0, 10);
  const tomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  /* ================= UPDATE ================= */
  const updateOrderStatus = async () => {
    try {
      setLoading(true);

      await adminApi.put(`/orders/${selectedOrder._id}/status`, { status });

      if (status !== "delivered" && eta) {
        await adminApi.put(`/orders/${selectedOrder._id}/estimated-date`, {
          estimatedDeliveryDate: eta,
        });
      }

      toast.success("Order updated");
      setSelectedOrder(null);
      setEta("");
      fetchOrders();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAYMENT ================= */



  const togglePaidStatus = async () => {
    try {
      setLoading(true);

      const { data } = await adminApi.put(
        `/orders/${selectedOrder._id}/payment-status`,
        {
          isPaid: !selectedOrder.isPaid,
        }
      );

      toast.success(data.message);
      setSelectedOrder(data.order);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update payment status");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BADGE ================= */
  const badge = (s) => {
    const map = {
      pending: "bg-gray-200 text-gray-700",
      confirmed: "bg-blue-100 text-blue-700",
      "in-transit": "bg-yellow-100 text-yellow-700",
      "deliver-today": "bg-orange-100 text-orange-700",
      "deliver-tomorrow": "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
    };
    return map[s] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#2F4F3E]">
        Orders Management
      </h1>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-[#F5EFE6]">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-3 font-mono text-xs">{o._id}</td>
                <td>{o.user?.name}</td>
                <td>{o.createdAt?.slice(0, 10)}</td>
                <td>₹{o.totalPrice}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs ${badge(o.orderStatus)}`}>
                    {o.orderStatus}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedOrder(o);
                      setStatus(o.orderStatus);
                      setEta(o.estimatedDeliveryDate?.slice(0, 10) || "");
                    }}
                    className="bg-[#2F4F3E] text-white px-3 py-1 rounded text-xs"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between">
              <p className="text-xs font-mono">{o._id.slice(-8)}</p>
              <span className={`px-2 py-1 text-xs rounded ${badge(o.orderStatus)}`}>
                {o.orderStatus}
              </span>
            </div>
            <div className="flex justify-between pt-3 pb-3">
              <p className="mt-2 font-semibold">{o.user?.name}</p>
              <span className="text-sm font-semibold">{o.createdAt?.slice(0, 10)}</span>
            </div>
            <p className="text-sm">₹{o.totalPrice}</p>

            <button
              onClick={() => {
                setSelectedOrder(o);
                setStatus(o.orderStatus);
                setEta(o.estimatedDeliveryDate?.slice(0, 10) || "");
              }}
              className="mt-3 w-full bg-[#2F4F3E] text-white py-2 rounded"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3">
          <div className="bg-white w-full max-w-xl p-5 rounded-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="float-right text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-3 pb-2">Order Details</h2>
            {/* CUSTOMER */}
            <p className="text-sm">
              <b>Customer :</b> {selectedOrder.user?.name}
            </p>
            <p className="text-sm">
              <b>Email :</b> {selectedOrder.user?.email}
            </p>
            <p className="text-sm">
              <b>Ordered on :</b> {selectedOrder.createdAt?.slice(0, 10)}
            </p>
            <p className="text-sm">
              <b>Order id:</b> {selectedOrder._id}
            </p>


            <hr className="my-3" />

            {/* ADDRESS */}
            <p className="text-sm font-semibold text-[#16271e] pb-2">
              Delivery Address
            </p>
            <p className="text-sm text-gray-700 ">
              {selectedOrder.shippingAddress.name}<br />
              {selectedOrder.shippingAddress.address}<br />
              {selectedOrder.shippingAddress.city},{" "}
              {selectedOrder.shippingAddress.state} –{" "}
              {selectedOrder.shippingAddress.pincode}<br />
              📞 {selectedOrder.shippingAddress.phone}
            </p>

            <hr className="my-3" />

            {/* PRODUCTS */}
            <p className="text-sm font-semibold text-[#2F4F3E] mb-1">
              Products
            </p>

            {selectedOrder.orderItems.map((item) => (
              <div
                key={item.product}
                className="flex justify-between text-sm border-b py-1"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <hr className="my-3" />

            {/* PRICE */}
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Items</span>
                <span>₹{selectedOrder.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{selectedOrder.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{selectedOrder.taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span className="pb-7">Total</span>
                <span>₹{selectedOrder.totalPrice}</span>
              </div>
            </div>
            <button
              onClick={togglePaidStatus}
              disabled={loading}
              className={`w-full mb-3 py-2 rounded text-white pb-2 ${selectedOrder.isPaid ? "bg-red-400" : "bg-green-500"
                }`}
            >
              {selectedOrder.isPaid ? "Mark As Unpaid" : "Mark As Paid"}
            </button>


            <hr className="my-4" />


            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                if (e.target.value === "deliver-today") setEta(today());
                if (e.target.value === "deliver-tomorrow") setEta(tomorrow());
              }}
              className="w-full border p-2 rounded mb-2"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-transit">In Transit</option>
              <option value="deliver-today">Deliver Today</option>
              <option value="deliver-tomorrow">Deliver Tomorrow</option>
              <option value="delivered">Delivered</option>
            </select>

            {status === "delivered" ? (
              <p className="text-green-700 font-semibold">
                Delivered on{" "}
                {new Date(selectedOrder.deliveredAt).toLocaleDateString()}
              </p>
            ) : (
              <input
                type="date"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />
            )}

            <button
              onClick={updateOrderStatus}
              disabled={loading}
              className="w-full bg-[#2F4F3E] text-white py-2 rounded"
            >
              Update Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
