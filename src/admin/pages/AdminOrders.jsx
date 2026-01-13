import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [eta, setEta] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await adminApi.get("/orders");
      setOrders(data.orders);
    } catch {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async () => {
    try {
      setLoading(true);

      await adminApi.put(`/orders/${selectedOrder._id}/status`, {
        status,
        estimatedDelivery: eta, // future ready
      });

      toast.success("Order updated");
      setSelectedOrder(null);
      fetchOrders();
    } catch {
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Order ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-3 font-mono text-xs">{order._id}</td>
                <td>
                  {order.user?.name}
                  <br />
                  <span className="text-xs text-gray-500">
                    {order.user?.email}
                  </span>
                </td>
                <td>{order.createdAt?.slice(0, 10)}</td>
                <td>₹{order.totalPrice}</td>

                <td>
                  <span className="px-2 py-1 rounded text-white text-xs bg-blue-600">
                    {order.orderStatus}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setStatus(order.orderStatus);
                    }}
                    className="bg-black text-white px-3 py-1 rounded text-xs"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl p-6 rounded shadow relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              Order Details
            </h2>

            {/* INFO */}
            <p><b>Order ID:</b> {selectedOrder._id}</p>
            <p><b>Total:</b> ₹{selectedOrder.totalPrice}</p>
            <p><b>Payment:</b> {selectedOrder.paymentMethod}</p>
            <p><b>Paid:</b> {selectedOrder.isPaid ? "Yes" : "No"}</p>

            <hr className="my-3" />

            {/* SHIPPING */}
            <h3 className="font-semibold mb-1">Shipping Address</h3>
            <p className="text-sm">
              {selectedOrder.shippingAddress.name}<br />
              {selectedOrder.shippingAddress.address}<br />
              {selectedOrder.shippingAddress.city},{" "}
              {selectedOrder.shippingAddress.state} –{" "}
              {selectedOrder.shippingAddress.pincode}<br />
              📞 {selectedOrder.shippingAddress.phone}
            </p>

            <hr className="my-3" />

            {/* PRODUCTS */}
            <h3 className="font-semibold mb-2">Products</h3>
            {selectedOrder.orderItems.map((item) => (
              <div key={item.product} className="text-sm flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price}</span>
              </div>
            ))}

            <hr className="my-3" />

            {/* UPDATE STATUS */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>

            <input
              type="date"
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <button
              disabled={loading}
              onClick={updateOrderStatus}
              className="w-full bg-[#2F4F3E] text-white py-2 rounded"
            >
              {loading ? "Updating..." : "Update Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
