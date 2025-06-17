import React, { useMemo } from 'react';
import { useStore } from '../contexts/StoreContext';
import './PriceDetails.css';

const PriceDetails = () => {
    const { cart, userData } = useStore();

    const { subtotal, firstOrderDiscount, deliveryFee, finalTotal } = useMemo(() => {
        if (!cart || cart.length === 0) {
            return { subtotal: 0, firstOrderDiscount: 0, deliveryFee: 0, finalTotal: 0 };
        }

        const sub = cart.reduce((total, item) => {
            const itemPrice = item.price - (item.price * item.discount / 100);
            return total + itemPrice * item.quantity;
        }, 0);
        
        // Use userData from context to check for first order
        const discount = userData.user?.hasPlacedFirstOrder ? 0 : sub * 0.30;
        const totalAfterDiscount = sub - discount;
        const fee = totalAfterDiscount > 0 && totalAfterDiscount < 3000 ? 50 : 0;
        const final = totalAfterDiscount + fee;

        return { subtotal: sub, firstOrderDiscount: discount, deliveryFee: fee, finalTotal: final };
    }, [cart, userData.user]);

    return (
        <div className="price-details-card">
            <h3>Price Details</h3>
            <div className="price-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {firstOrderDiscount > 0 && (
                <div className="price-row discount">
                    <span>First Order Discount</span>
                    <span>- ₹{firstOrderDiscount.toFixed(2)}</span>
                </div>
            )}
            <div className="price-row">
                <span>Delivery Fee</span>
                <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'FREE'}</span>
            </div>
            <hr />
            <div className="price-row total">
                <span>Total Amount</span>
                <span>₹{finalTotal.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default PriceDetails;