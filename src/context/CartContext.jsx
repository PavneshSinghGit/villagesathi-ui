import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('sathiCart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Cart parsing error", e);
                setCartItems([]);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('sathiCart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        setCartItems((prev) => {
            const isItemInCart = prev.find((i) => i.itemID === item.itemID);
            if (isItemInCart) {
                return prev.map((i) =>
                    i.itemID === item.itemID ? { ...i, quantity: (i.quantity || 1) + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    // --- NAYA FUNCTION: Quantity handle karne ke liye ---
    const updateQuantity = (itemID, newQty) => {
        if (newQty < 1) {
            // Agar quantity 0 ho jaye to item nikaal do
            removeFromCart(itemID);
        } else {
            setCartItems((prev) =>
                prev.map((item) =>
                    item.itemID === itemID ? { ...item, quantity: newQty } : item
                )
            );
        }
    };

    const removeFromCart = (itemID) => {
        setCartItems((prev) => prev.filter((item) => item.itemID !== itemID));
    };

    const clearCart = () => setCartItems([]);

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            updateQuantity, // Isse exports mein add kiya
            removeFromCart, 
            clearCart, 
            getCartTotal 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);