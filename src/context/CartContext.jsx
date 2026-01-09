import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingProductId, setLoadingProductId] = useState(null);

    // 🔐 Get logged-in user
    const [userInfo, setUserInfo] = useState(
        JSON.parse(localStorage.getItem("userInfo"))
    );
    useEffect(() => {
        const syncUser = () => {
            setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
        };

        window.addEventListener("storage", syncUser);
        syncUser(); // initial sync

        return () => window.removeEventListener("storage", syncUser);
    }, []);


    // 🔄 Fetch cart ONLY if logged in
    const fetchCart = async () => {
        if (!userInfo?.token) {
            setCart(null);
            return;
        }

        try {
            const { data } = await api.get("/cart");
            setCart(data.cart);
        } catch (error) {
            const msg = error.response?.data?.message;

            // Token invalid / expired
            if (msg?.toLowerCase().includes("token")) {
                setCart(null);
                localStorage.removeItem("userInfo");
            }

            console.error("Fetch cart error:", msg || error.message);
        }
    };

    // ➕ Add to cart (login required)
    const addToCart = async (productId, qty = 1) => {
        if (!userInfo?.token) {
            toast.warning("Please login to add items to cart");
            return;
        }

        try {
            setLoadingProductId(productId);
            const { data } = await api.post("/cart/add", {
                productId,
                quantity: qty,
            });
            setCart(data.cart);
            toast.success("Added to cart");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to add to cart"
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
            toast.error("Failed to remove item");
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
            toast.error("Failed to update quantity");
        }
    };

    // 🔽 Decrease quantity
    const decreaseQty = async (itemId) => {
        try {
            const { data } = await api.put(`/cart/decrease/${itemId}`);
            setCart(data.cart);
        } catch (error) {
            toast.error("Failed to update quantity");
        }
    };

    // 🔄 Run when login/logout happens
    useEffect(() => {
        fetchCart();
    }, [userInfo?.token]);

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

export const useCart = () => useContext(CartContext);
