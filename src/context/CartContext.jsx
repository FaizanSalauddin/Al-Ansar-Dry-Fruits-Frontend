import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";


const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);

    // ✅ ADD THIS LINE (FIX)
    const [loading, setLoading] = useState(false);

    const [loadingProductId, setLoadingProductId] = useState(null);

    // 🔄 Load cart from backend
    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/cart");
            setCart(data.cart);
        } catch (error) {
            console.error("Fetch cart error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // ➕ Add to cart
    const addToCart = async (productId, qty = 1) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoadingProductId(productId);

            const res = await api.post("/cart/add", {
                productId,
                quantity: qty,
            });

            setCart(res.data.cart);
            toast.success("Added to cart", {
                style: {
                    background: "#2F4F3E",
                    color: "#fff",
                },
            });
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error("Please login first");
            } else {
                toast.error("Failed to add item");
            }
        } finally {
            setLoadingProductId(null);
        }
    };

    // ❌ Remove from cart
    const removeFromCart = async (itemId) => {
        try {
            setLoading(true);
            const { data } = await api.delete(`/cart/remove/${itemId}`);
            setCart(data.cart);
        } catch (error) {
            console.error("Remove cart error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // 🔼 Increase quantity
    const increaseQty = async (itemId) => {
        try {
            const { data } = await api.put(`/cart/increase/${itemId}`);
            setCart(data.cart);
        } catch (error) {
            console.error(error.message);
        }
    };

    // 🔽 Decrease quantity
    const decreaseQty = async (itemId) => {
        try {
            const { data } = await api.put(`/cart/decrease/${itemId}`);
            setCart(data.cart);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                fetchCart,
                addToCart,
                removeFromCart,
                increaseQty,
                decreaseQty,
                loadingProductId,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// ✅ Custom hook
export const useCart = () => useContext(CartContext);
