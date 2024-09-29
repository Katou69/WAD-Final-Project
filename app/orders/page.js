// 'use client'; // This file is a Client Component

// import { useState, useEffect } from 'react';

// export default function OrdersPage({ updateOrders }) {
//     const [customers, setCustomers] = useState([]);
//     const [products, setProducts] = useState([]);
//     const [orders, setOrders] = useState([]);
//     const [selectedCustomer, setSelectedCustomer] = useState('');
//     const [selectedProduct, setSelectedProduct] = useState('');
//     const [quantity, setQuantity] = useState(1);

//     useEffect(() => {
//         fetchCustomers();
//         fetchProducts();
//         fetchOrders();
//     }, []);

//     async function fetchCustomers() {
//         const res = await fetch('/api/customers');
//         const data = await res.json();
//         setCustomers(data.data);
//     }

//     async function fetchProducts() {
//         const res = await fetch('/api/products');
//         const data = await res.json();
//         setProducts(data.data);
//     }

//     async function fetchOrders() {
//         const res = await fetch('/api/orders');
//         const data = await res.json();
//         setOrders(data.data);
//     }

//     async function handleAddOrder(e) {
//         e.preventDefault();

//         try {
//             const res = await fetch('/api/orders', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     customerId: selectedCustomer,
//                     productId: selectedProduct,
//                     quantity,
//                 }),
//             });

//             if (!res.ok) {
//                 const errorData = await res.json();
//                 console.error("Failed to add order:", errorData);
//                 alert(`Error: ${errorData.error || 'Failed to add order.'}`);
//                 return;
//             }

//             const data = await res.json();
//             console.log("Order added successfully:", data);
//             alert("Order added successfully!");

//             // Call the updateOrders function passed from Dashboard
//             updateOrders(data.data); // Update the orders in the Dashboard

//             // Reset form fields
//             setSelectedCustomer('');
//             setSelectedProduct('');
//             setQuantity(1);
//         } catch (error) {
//             console.error("Error adding order:", error);
//         }
//     }

//     return (
//         <div>
//             <h1>Place an Order</h1>
//             <form onSubmit={handleAddOrder}>
//                 <select
//                     value={selectedCustomer}
//                     onChange={(e) => setSelectedCustomer(e.target.value)}
//                     required
//                 >
//                     <option value="">Select Customer</option>
//                     {customers.map(customer => (
//                         <option key={customer._id} value={customer._id}>
//                             {customer.name}
//                         </option>
//                     ))}
//                 </select>

//                 <select
//                     value={selectedProduct}
//                     onChange={(e) => setSelectedProduct(e.target.value)}
//                     required
//                 >
//                     <option value="">Select Product</option>
//                     {products.map(product => (
//                         <option key={product._id} value={product._id}>
//                             {product.name}
//                         </option>
//                     ))}
//                 </select>

//                 <input
//                     type="number"
//                     value={quantity}
//                     onChange={(e) => setQuantity(e.target.value)}
//                     min="1"
//                     required
//                 />

//                 <button type="submit">Add Order</button>
//             </form>

//             <h2>Orders List</h2>
//             <ul>
//                 {orders.map(order => (
//                     <li key={order._id}>
//                         Customer: {order.customerId.name} - Product: {order.productId.name} - Quantity: {order.quantity}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }


// app/orders/page.js

'use client';

import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Link from 'next/link';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [editOrderId, setEditOrderId] = useState(null);
    const [editedQuantity, setEditedQuantity] = useState(1);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newOrder, setNewOrder] = useState({
        productId: '',
        customerId: '',
        quantity: 1,
    });
    const [availableProducts, setAvailableProducts] = useState([]);
    const [availableCustomers, setAvailableCustomers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const productsRes = await fetch('/api/products');
            const customersRes = await fetch('/api/customers');
            const productsData = await productsRes.json();
            const customersData = await customersRes.json();
            setAvailableProducts(productsData.data);
            setAvailableCustomers(customersData.data);
        }
        fetchData();

        async function fetchOrders() {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.data); // Update state with fetched orders
            } else {
                console.error('Error fetching orders:', await res.json());
            }
        }
        fetchOrders();
    }, []);

    const handleEditClick = (order) => {
        setEditOrderId(order._id);
        setEditedQuantity(order.quantity);
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            const res = await fetch(`/api/orders/${editOrderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: editedQuantity }),  // Only update quantity
            });

            if (res.ok) {
                const updatedOrder = await res.json();
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === editOrderId ? { ...order, quantity: editedQuantity } : order
                    )
                );
                setShowEditModal(false);
                setEditOrderId(null);
            } else {
                console.error('Error saving order:', await res.json());
            }
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    const handleAddOrder = async () => {
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrder),
            });

            if (res.ok) {
                const data = await res.json();
                setOrders([...orders, data.data]);
                clearFormFields();
                setShowAddModal(false);
            } else {
                console.error('Error adding order');
            }
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setOrders(orders.filter(order => order._id !== orderId));
            } else {
                console.error('Failed to delete order:', await res.json());
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const clearFormFields = () => {
        setNewOrder({
            productId: '',
            customerId: '',
            quantity: 1,
        });
    };

    return (
        <div className="page-container">
            <h2>Orders</h2>
            <button onClick={() => setShowAddModal(true)}>Add Order</button>

            <div className="card-grid">
                {orders.map((order) => (
                    <Card
                        key={order._id}
                        title={`Product: ${order.productId ? order.productId.name : 'Unknown Product'}`}
                        description={`Customer: ${order.customerId ? order.customerId.name : 'Unknown Customer'}, Quantity: ${order.quantity}`}
                        onEditClick={() => handleEditClick(order)}  // Edit button
                        onDeleteClick={() => handleDeleteOrder(order._id)}  // Delete button
                        showEditDeleteButtons={true}  // Show buttons
                    />
                ))}
            </div>

            {/* Add Order Modal */}
            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add New Order</h2>
                        <select
                            value={newOrder.productId}
                            onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}
                        >
                            {availableProducts.map((product) => (
                                <option key={product._id} value={product._id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={newOrder.customerId}
                            onChange={(e) => setNewOrder({ ...newOrder, customerId: e.target.value })}
                        >
                            {availableCustomers.map((customer) => (
                                <option key={customer._id} value={customer._id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>

                        <button onClick={handleAddOrder}>Add Order</button>
                        <button onClick={() => setShowAddModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Edit Order Modal */}
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Order Quantity</h2>
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={editedQuantity}
                            onChange={(e) => setEditedQuantity(e.target.value)}
                        />
                        <button onClick={handleSaveEdit}>Save Changes</button>
                        <button onClick={() => setShowEditModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <Link href="/#">
                <button className="manage-button">Back to Dashboard</button>
            </Link>

            <footer>
                <p>© 2024 XO TechZone</p>
            </footer>
        </div>
    );
}
