import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get("/orders");
            setOrders(data.orders || data);
        } catch (err) {
            toast.error("Failed to fetch orders");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            setLoadingId(orderId);

            await api.put(`/orders/${orderId}/status`, {
                status,
            });

            toast.success("Order status updated");
            fetchOrders();
        } catch (err) {
            toast.error("Status update failed");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Orders</h1>

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Order ID</th>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-t">
                                <td className="p-3">{order._id.slice(-6)}</td>
                                <td className="p-3">{order.user?.name || "User"}</td>
                                <td className="p-3 text-center">₹{order.totalPrice}</td>

                                <td className="p-3 text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs text-white ${order.orderStatus === "delivered"
                                            ? "bg-green-600"
                                            : order.orderStatus === "paid"
                                                ? "bg-blue-600"
                                                : "bg-yellow-600"
                                            }`}
                                    >
                                        {order.orderStatus || "pending"}
                                    </span>
                                </td>

                                <td className="p-3 text-center">
                                    <select
                                        value={order.isPaid ? "paid" : order.orderStatus}
                                        onChange={(e) => updateOrder(order._id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        {!order.isPaid && <option value="paid">Mark as Paid</option>}
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                    </select>

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
        </div>
    );
}

export default AdminOrders;
