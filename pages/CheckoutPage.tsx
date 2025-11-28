
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import { useForm } from '../hooks/useForm';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface CheckoutForm {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    zip: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
}

const CheckoutPage: React.FC = () => {
    useDocumentTitle('Checkout');
    const { cartItems, cartTotal, clearCart } = useCart();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const { values, errors, handleChange, isValid } = useForm<CheckoutForm>({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        country: '',
        zip: '',
        cardNumber: '4242 4242 4242 4242',
        expiry: '12 / 25',
        cvc: '123'
    }, {
        email: { required: true, pattern: /^\S+@\S+\.\S+$/ },
        firstName: { required: true },
        lastName: { required: true },
        address: { required: true },
        city: { required: true },
        country: { required: true },
        zip: { required: true },
        cardNumber: { required: true },
        expiry: { required: true },
        cvc: { required: true }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid()) {
            // Process Payment...
            clearCart();
            addToast('Order placed successfully!', 'success');
            navigate('/confirmation');
        } else {
            addToast('Please fix the errors in the form.', 'error');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-3xl font-serif">Your Cart is Empty</h1>
                <p className="mt-4 text-gray-600">You can't proceed to checkout without any items.</p>
                <Button variant="secondary" className="mt-8" onClick={() => navigate('/products')}>
                    Continue Shopping
                </Button>
            </div>
        )
    }

    const InputClass = (error?: string) => `w-full p-3 border rounded focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-gold focus:ring-brand-gold'}`;

    return (
        <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
                <h2 className="text-2xl font-serif mb-6">Contact & Shipping</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input 
                            name="email" type="email" placeholder="Email Address" 
                            value={values.email} onChange={handleChange} 
                            className={InputClass(errors.email)}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <input 
                                name="firstName" type="text" placeholder="First Name" 
                                value={values.firstName} onChange={handleChange}
                                className={InputClass(errors.firstName)}
                            />
                             {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div className="w-1/2">
                            <input 
                                name="lastName" type="text" placeholder="Last Name" 
                                value={values.lastName} onChange={handleChange}
                                className={InputClass(errors.lastName)}
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                        </div>
                    </div>

                    <div>
                        <input 
                            name="address" type="text" placeholder="Address" 
                            value={values.address} onChange={handleChange}
                            className={InputClass(errors.address)}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <input 
                                name="city" type="text" placeholder="City" 
                                value={values.city} onChange={handleChange}
                                className={InputClass(errors.city)}
                            />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                        </div>
                        <div className="w-1/3">
                            <input 
                                name="country" type="text" placeholder="Country" 
                                value={values.country} onChange={handleChange}
                                className={InputClass(errors.country)}
                            />
                            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                        </div>
                        <div className="w-1/3">
                             <input 
                                name="zip" type="text" placeholder="Postal Code" 
                                value={values.zip} onChange={handleChange}
                                className={InputClass(errors.zip)}
                            />
                            {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-serif pt-8 mb-6">Payment Details</h2>
                    <p className="text-sm text-gray-600">Using Stripe test keys. Do not enter real card details.</p>
                    
                    <div>
                        <input 
                            name="cardNumber" type="text" placeholder="Card Number" 
                            value={values.cardNumber} onChange={handleChange}
                            className={InputClass(errors.cardNumber)}
                        />
                         {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="flex gap-4">
                         <div className="w-1/2">
                            <input 
                                name="expiry" type="text" placeholder="MM / YY" 
                                value={values.expiry} onChange={handleChange}
                                className={InputClass(errors.expiry)}
                            />
                            {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                        </div>
                         <div className="w-1/2">
                             <input 
                                name="cvc" type="text" placeholder="CVC" 
                                value={values.cvc} onChange={handleChange}
                                className={InputClass(errors.cvc)}
                            />
                             {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                        </div>
                    </div>

                    <Button type="submit" fullWidth className="mt-6">Place Order</Button>
                </form>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm h-fit">
                <h2 className="text-2xl font-serif mb-6">Order Summary</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded"/>
                                <div>
                                    <p className="font-semibold text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
                                </div>
                            </div>
                            <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div className="border-t mt-6 pt-6 space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <p>Subtotal</p>
                        <p>${cartTotal.toLocaleString()}</p>
                    </div>
                     <div className="flex justify-between text-gray-600">
                        <p>Shipping</p>
                        <p className="text-green-600 font-medium">Free</p>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                        <p>Total</p>
                        <p>${cartTotal.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default CheckoutPage;
