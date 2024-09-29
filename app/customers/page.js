// 'use client'; // This file is a Client Component

// import { useState, useEffect } from 'react';

// export default function CustomersPage() {
//     const [customers, setCustomers] = useState([]);
//     const [name, setName] = useState('');
//     const [phone, setPhone] = useState('');
//     const [email, setEmail] = useState('');
//     const [address, setAddress] = useState('');

//     useEffect(() => {
//         fetchCustomers();
//     }, []);

//     async function fetchCustomers() {
//         try {
//             const res = await fetch('/api/customers');
//             if (!res.ok) {
//                 throw new Error(`HTTP error! status: ${res.status}`);
//             }
//             const data = await res.json();
//             setCustomers(data.data);
//         } catch (error) {
//             console.error("Failed to fetch customers:", error);
//         }
//     }

//     async function handleAddCustomer(e) {
//         e.preventDefault();

//         const customerData = {
//             name,
//             phone,
//             email,
//             address,
//         };

//         // Check for empty fields
//         if (!customerData.name || !customerData.phone || !customerData.email || !customerData.address) {
//             alert("Please fill in all fields.");
//             return;
//         }

//         try {
//             const res = await fetch('/api/customers', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(customerData),
//             });

//             if (!res.ok) {
//                 const errorData = await res.json(); // Get error message
//                 console.error("Failed to add customer:", errorData);
//                 alert(`Error: ${errorData.error || 'Failed to add customer.'}`);
//                 return;
//             }

//             const data = await res.json();
//             console.log("Customer added successfully:", data);
            
//             // Reset input fields
//             setName('');
//             setPhone('');
//             setEmail('');
//             setAddress('');

//             // Fetch updated customer list
//             fetchCustomers();
//         } catch (error) {
//             console.error("Error adding customer:", error);
//         }
//     }

//     return (
//         <div>
//             <h1>Customers</h1>
//             <form onSubmit={handleAddCustomer}>
//                 <input 
//                     type="text" 
//                     placeholder="Name" 
//                     value={name} 
//                     onChange={(e) => setName(e.target.value)} 
//                     required 
//                 />
//                 <input 
//                     type="text" 
//                     placeholder="Phone" 
//                     value={phone} 
//                     onChange={(e) => setPhone(e.target.value)} 
//                     required 
//                 />
//                 <input 
//                     type="email" 
//                     placeholder="Email" 
//                     value={email} 
//                     onChange={(e) => setEmail(e.target.value)} 
//                     required 
//                 />
//                 <input 
//                     type="text" 
//                     placeholder="Address" 
//                     value={address} 
//                     onChange={(e) => setAddress(e.target.value)} 
//                     required 
//                 />
//                 <button type="submit">Add Customer</button>
//             </form>

//             <h2>Customer List</h2>
//             <ul>
//                 {customers.map((customer) => (
//                     <li key={customer._id}>
//                         {customer.name} - {customer.phone} - {customer.email} - {customer.address}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// app/customers/page.js

// /app/customers/page.js
'use client';

import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Link from 'next/link';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [editCustomerId, setEditCustomerId] = useState(null);
    const [editedCustomer, setEditedCustomer] = useState(null);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        address: '',
        phone: ''
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        async function fetchCustomers() {
            const res = await fetch('/api/customers');
            const data = await res.json();
            setCustomers(data.data);
        }
        fetchCustomers();
    }, []);

    const handleEditClick = (customer) => {
        setEditCustomerId(customer._id);  // Set the customer ID to be edited
        setEditedCustomer(customer);  // Set the customer's current data to be edited
        setShowEditModal(true);  // Open the edit modal
    };

    const handleSaveEdit = async () => {
        try {
            const res = await fetch(`/api/customers/${editCustomerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedCustomer),
            });
    
            if (res.ok) {
                setCustomers((prevCustomers) =>
                    prevCustomers.map((customer) =>
                        customer._id === editCustomerId ? { ...customer, ...editedCustomer } : customer
                    )
                );
                setShowEditModal(false);
                setEditCustomerId(null);
            } else {
                console.error('Failed to save customer:', await res.json());
            }
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };
    
    const handleAddCustomer = async () => {
        const newCustomerData = {
            name: newCustomer.name,
            phone: newCustomer.phone,
            email: newCustomer.email,
            address: newCustomer.address,
        };
    
        // Ensure all required fields are filled
        if (!newCustomerData.name || !newCustomerData.phone || !newCustomerData.email || !newCustomerData.address) {
            console.error('All fields are required');
            return;
        }
    
        try {
            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCustomerData),
            });
    
            if (res.ok) {
                const data = await res.json();
                setCustomers([...customers, data.data]);
                clearFormFields();
                setShowAddModal(false);
            } else {
                const errorData = await res.json();
                console.error('Error adding customer:', errorData);
            }
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const handleDeleteCustomer = async (customerId) => {
        try {
            const res = await fetch(`/api/customers/${customerId}`, {
                method: 'DELETE',
            });
    
            if (res.ok) {
                setCustomers((prevCustomers) => prevCustomers.filter(customer => customer._id !== customerId));
            } else {
                console.error('Failed to delete customer:', await res.json());
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const clearFormFields = () => {
        setNewCustomer({ name: '', email: '', address: '', phone: '' });
    };

    return (
        <div className="page-container">
            <h2>Customers</h2>
            <button onClick={() => setShowAddModal(true)}>Add Customer</button>

            <div className="card-grid">
                {customers.map((customer) => (
                    <Card
                        key={customer._id}
                        title={customer.name}
                        description={`Phone: ${customer.phone}, Email: ${customer.email}`}
                        onEditClick={() => handleEditClick(customer)}  // Call handleEditClick when edit button is clicked
                        onDeleteClick={() => handleDeleteCustomer(customer._id)}
                        showEditDeleteButtons={true}
                    />
                ))}
            </div>

            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add New Customer</h2>
                        <input
                            type="text"
                            placeholder="Customer Name"
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={newCustomer.address}
                            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                        />
                        <button onClick={handleAddCustomer}>Add Customer</button>
                        <button onClick={() => setShowAddModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Customer</h2>
                        <input
                            type="text"
                            placeholder="Customer Name"
                            value={editedCustomer.name}
                            onChange={(e) => setEditedCustomer({ ...editedCustomer, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            value={editedCustomer.phone}
                            onChange={(e) => setEditedCustomer({ ...editedCustomer, phone: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editedCustomer.email}
                            onChange={(e) => setEditedCustomer({ ...editedCustomer, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={editedCustomer.address}
                            onChange={(e) => setEditedCustomer({ ...editedCustomer, address: e.target.value })}
                        />
                        <button onClick={handleSaveEdit}>Save Changes</button>  {/* Call handleSaveEdit when clicked */}
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
