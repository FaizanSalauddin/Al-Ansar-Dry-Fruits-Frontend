import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";




const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingProductId, setLoadingProductId] = useState(null);

    // 🔐 Fetch cart (protected)
    const fetchCart = async () => {
        try {
            const { data } = await api.get("/cart");
            setCart(data.cart);
        } catch (error) {
            console.error(
                "Fetch cart error:",
                error.response?.data?.message || error.message
            );
        }
    };

    const addToCart = async (productId, qty = 1) => {
        try {
            setLoadingProductId(productId);
            const { data } = await api.post("/cart/add", {
                productId,
                quantity: qty,
            });
            setCart(data.cart);
        } catch (error) {
            console.error(
                error.response?.data?.message || error.message
            );
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
