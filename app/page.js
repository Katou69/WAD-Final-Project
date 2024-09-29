'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from './components/Card';

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data.data);
        }
        fetchProducts();
        async function fetchCustomers() {
            const res = await fetch('/api/customers');
            const data = await res.json();
            setCustomers(data.data);
        }
        fetchCustomers();
    }, []);

    const handleBuyClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleSubmitOrder = async () => {
        const orderData = {
            productId: selectedProduct._id,
            customerId: selectedCustomer,
            quantity,
        };

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (response.ok) {
            alert('Order successfully placed!');
            setShowModal(false);  // Close the modal
        } else {
            const errorData = await response.json();
            console.error('Error creating order:', errorData);
        }
    };

    return (
        <div className="page-container">
            <header>
                <h1>Dashboard</h1>
            </header>

            <div className="manage-buttons">
                <Link href="/products">
                    <button className="manage-button">Manage Products</button>
                </Link>
                <Link href="/customers">
                    <button className="manage-button">Manage Customers</button>
                </Link>
                <Link href="/orders">
                    <button className="manage-button">View Orders</button>
                </Link>
            </div>

            <h2>Products</h2>
            <div className="card-grid">
                {products.map((product) => (
                    <Card
                        key={product._id}
                        product={product}
                        title={product.name}
                        description={`Price: $${product.price} - Seller: ${product.sellerName}`}
                        imageUrl={product.image}
                        isDashboard={true} // Only show the "Buy" button
                        onBuyClick={() => handleBuyClick(product)}  // Show only Buy button
                    />
                ))}
            </div>

            {/* Modal for order submission */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Place Order for {selectedProduct.name}</h2>
                        <label>Customer:</label>
                        <select
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                        >
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                                <option key={customer._id} value={customer._id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                        <br></br>
                        <br></br>
                        <label>Quantity:</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                        />
                        <br></br>
                        <button onClick={handleSubmitOrder}>Confirm Order</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <footer>
                <p>© 2024 XO TechZone</p>
            </footer>
        </div>
    );
}
