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
      setOrders(data.orders || []);
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

      // 1️⃣ Update status
      await adminApi.put(`/orders/${selectedOrder._id}/status`, {
        status,
      });

      // 2️⃣ Update estimated delivery date (ONLY if selected)
      if (eta) {
        await adminApi.put(
          `/orders/${selectedOrder._id}/estimated-date`,
          {
            estimatedDeliveryDate: eta,
          }
        );
      }

      toast.success("Order updated successfully");
      setSelectedOrder(null);
      setEta("");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#2F4F3E]">
        Orders Management
      </h1>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F5EFE6] text-[#2F4F3E]">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="
                           border-t
                           transition
                           duration-200
                          hover:bg-[#F5EFE6]
                            hover:shadow-sm"
              >
                <td className="p-3 font-mono text-xs">
                  {order._id}
                </td>

                <td className="p-3">
                  <div className="font-medium">
                    {order.user?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email}
                  </div>
                </td>

                <td className="p-3 text-center">
                  {order.createdAt?.slice(0, 10)}
                </td>

                <td className="p-3 text-center font-semibold">
                  ₹{order.totalPrice}
                </td>

                <td className="p-3 text-center">
                  <span className="px-3 py-1 rounded-full text-xs text-white bg-[#2F4F3E]">
                    {order.orderStatus}
                  </span>
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setStatus(order.orderStatus);
                      setEta(
                        order.estimatedDeliveryDate
                          ? order.estimatedDeliveryDate.slice(0, 10)
                          : ""
                      );
                    }}

                    className="
  bg-[#2F4F3E]
  text-white
  px-3 py-1
  rounded
  text-xs
  transition
  hover:bg-[#244235]
  hover:shadow
"

                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            No orders found
          </p>
        )}
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="
    bg-white
    rounded-xl
    shadow
    p-4
    space-y-3
    transition
    duration-200
    hover:shadow-lg
    hover:scale-[1.01]
    active:scale-[0.99]
  "
          >

            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-mono text-xs break-all">
                  {order._id}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs text-white bg-[#2F4F3E]">
                {order.orderStatus}
              </span>
            </div>

            <div className="text-sm">
              <p className="font-semibold">
                {order.user?.name}
              </p>
              <p className="text-gray-500 text-xs">
                {order.user?.email}
              </p>
            </div>

            <div className="flex justify-between text-sm">
              <span>Date</span>
              <span>{order.createdAt?.slice(0, 10)}</span>
            </div>

            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>₹{order.totalPrice}</span>
            </div>

            <button
              onClick={() => {
                setSelectedOrder(order);
                setStatus(order.orderStatus);
              }}
              className="
  w-full
  bg-[#2F4F3E]
  text-white
  py-2
  rounded-lg
  text-sm
  transition
  hover:bg-[#244235]
  active:scale-[0.98]
"

            >
              View Order Details
            </button>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-center text-gray-500">
            No orders found
          </p>
        )}
      </div>

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="
  absolute
  top-3
  right-3
  text-xl
  text-gray-500
  hover:text-black
  transition
"

            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-[#2F4F3E] mb-4">
              Order Details
            </h2>

            <p className="text-sm"><b>Order ID:</b> {selectedOrder._id}</p>
            <p className="text-sm"><b>Total:</b> ₹{selectedOrder.totalPrice}</p>
            <p className="text-sm"><b>Payment:</b> {selectedOrder.paymentMethod}</p>
            <p className="text-sm"><b>Paid:</b> {selectedOrder.isPaid ? "Yes" : "No"}</p>

            <hr className="my-3" />

            <h3 className="font-semibold text-[#2F4F3E] mb-1">
              Shipping Address
            </h3>

            <p className="text-sm text-gray-700">
              {selectedOrder.shippingAddress.name}<br />
              {selectedOrder.shippingAddress.address}<br />
              {selectedOrder.shippingAddress.city},{" "}
              {selectedOrder.shippingAddress.state} –{" "}
              {selectedOrder.shippingAddress.pincode}<br />
              📞 {selectedOrder.shippingAddress.phone}
            </p>

            <hr className="my-3" />

            <h3 className="font-semibold text-[#2F4F3E] mb-2">
              Products
            </h3>

            {selectedOrder.orderItems.map((item) => (
              <div
                key={item.product}
                className="flex justify-between text-sm mb-1"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price}</span>
              </div>
            ))}

            <hr className="my-3" />

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

            <label className="text-sm font-medium text-gray-600">
              Estimated Delivery Date
            </label>

            <input
              type="date"
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <button
              disabled={loading}
              onClick={updateOrderStatus}
              className="w-full bg-[#2F4F3E] text-white py-2 rounded-lg"
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
