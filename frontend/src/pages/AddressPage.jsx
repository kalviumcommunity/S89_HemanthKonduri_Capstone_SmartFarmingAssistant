import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '/src/contexts/StoreContext';
import './CheckoutPages.css';

const AddressPage = () => {
    const { userData, addAddress, loading } = useStore();
    const navigate = useNavigate();
    
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', state: '', zip: '', phone: '' });

    useEffect(() => {
        if (userData.user?.addresses?.length > 0 && !selectedAddress) {
            setSelectedAddress(userData.user.addresses[0]);
        }
    }, [userData.user, selectedAddress]);

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        await addAddress(newAddress);
        setIsAddingNew(false);
        setNewAddress({ name: '', street: '', city: '', state: '', zip: '', phone: '' });
    };

    const handleProceedToPayment = () => {
        if (!selectedAddress) {
            alert("Please select a delivery address.");
            return;
        }
        navigate('/checkout/payment', { state: { deliveryAddress: selectedAddress } });
    };

    return (
        <div className="checkout-page container">
            <button onClick={() => navigate('/cart')} className="back-link">← Back to Cart</button>
            <h1>Select Delivery Address</h1>
            <div className="address-list">
                {userData.user?.addresses.map((addr) => (
                    <div key={addr._id} className={`address-card ${selectedAddress?._id === addr._id ? 'selected' : ''}`} onClick={() => setSelectedAddress(addr)}>
                        <div className="radio-icon"></div>
                        <div className="address-content">
                            <strong>{addr.name}</strong>
                            <p>{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
                            <p>Phone: {addr.phone}</p>
                        </div>
                    </div>
                ))}
                <div className="address-card add-new" onClick={() => setIsAddingNew(true)}>
                    + Add New Address
                </div>
            </div>

            {isAddingNew && (
                <form className="address-form" onSubmit={handleAddressSubmit}>
                    <h3>Add New Address</h3>
                    <div className="form-grid">
                        <input type="text" placeholder="Full Name" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} required />
                        <input type="tel" placeholder="Phone Number" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} required />
                    </div>
                    <input type="text" placeholder="Street Address, House No." value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required />
                    <div className="form-grid">
                        <input type="text" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required />
                        <input type="text" placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} required />
                        <input type="text" placeholder="ZIP Code" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} required />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Save Address</button>
                        <button type="button" onClick={() => setIsAddingNew(false)} className="btn-secondary">Cancel</button>
                    </div>
                </form>
            )}
            
            <button onClick={handleProceedToPayment} className="btn-primary proceed-btn">Proceed to Payment</button>
        </div>
    );
};
export default AddressPage;