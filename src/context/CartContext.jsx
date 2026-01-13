import { createContext, useContext, useEffect, useState } from "react";
import userApi from "../api/userApi";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";


const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingProductId, setLoadingProductId] = useState(null);
    const { user } = useAuth();



    useEffect(() => {
        fetchCart();
    }, [user?.token]);


    // 🔄 Fetch cart ONLY if logged in
    const fetchCart = async () => {
        if (!user?.token) {
            setCart(null);
            return;
        }

        try {
            const { data } = await userApi.get("/cart");
            setCart(data.cart);
        } catch (error) {
            setCart(null);
        }
    };


    // ➕ Add to cart (login required)
    const addToCart = async (productId, qty = 1) => {
        if (!user?.token) {
            toast.warning("Please login to add items to cart");
            return;
        }

        try {
            setLoadingProductId(productId);
            const { data } = await userApi.post("/cart/add", {
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
            const { data } = await userApi.delete(`/cart/remove/${itemId}`);
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
            const { data } = await userApi.put(`/cart/increase/${itemId}`);
            setCart(data.cart);
        } catch (error) {
            toast.error("Failed to update quantity");
        }
    };

    // 🔽 Decrease quantity
    const decreaseQty = async (itemId) => {
        try {
            const { data } = await userApi.put(`/cart/decrease/${itemId}`);
            setCart(data.cart);
        } catch (error) {
            toast.error("Failed to update quantity");
        }
    };

    // 🔄 Run when login/logout happens
    useEffect(() => {
        fetchCart();
    }, [user?.token]);

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
