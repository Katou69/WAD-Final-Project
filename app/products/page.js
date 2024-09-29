'use client';

import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Link from 'next/link';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    const [editedProduct, setEditedProduct] = useState({
        name: '',
        price: '',
        sellerName: '',
        sellerLocation: '',
        imageFile: null,  // Add this for image in edited products
    });
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        sellerName: '',
        sellerLocation: '',
        imageFile: null,  // Add this for image in new products
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Fetch existing products from the API
    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data.data);
        }
        fetchProducts();
    }, []);

    // Handle product edit
    const handleEditClick = (product) => {
        setEditProductId(product._id);
        setEditedProduct({
            ...product,
            imageFile: null,  // Add image file handling here
        });
        setShowEditModal(true);
    };

    // Save the edited product
    const handleSaveEdit = async () => {
        const formData = new FormData();
        formData.append('name', editedProduct.name);
        formData.append('price', editedProduct.price);
        formData.append('sellerName', editedProduct.sellerName);
        formData.append('sellerLocation', editedProduct.sellerLocation);

        // Append image file if a new one is provided
        if (editedProduct.imageFile) {
            formData.append('image', editedProduct.imageFile);
        }

        try {
            const res = await fetch(`/api/products/${editProductId}`, {
                method: 'PUT',
                body: formData,
            });

            if (res.ok) {
                const updatedProduct = await res.json();
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product._id === editProductId ? updatedProduct.data : product
                    )
                );
                setShowEditModal(false);
                setEditProductId(null);
            } else {
                const errorData = await res.json();
                console.error('Failed to edit product:', errorData);
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    // Add a new product
    const handleAddProduct = async () => {
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('sellerName', newProduct.sellerName);
        formData.append('sellerLocation', newProduct.sellerLocation);
    
        // Append image file only if it's provided
        if (newProduct.imageFile) {
            formData.append('image', newProduct.imageFile);
        }
    
        // Debugging: Log formData entries to ensure proper submission
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                body: formData,
            });
    
            if (res.ok) {
                const data = await res.json();
                setProducts([...products, data.data]);
                clearFormFields();
                setShowAddModal(false);
            } else {
                const errorData = await res.json();
                console.error('Error adding product:', errorData);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setProducts(products.filter(product => product._id !== productId));
            } else {
                console.error('Failed to delete product:', await res.json());
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const clearFormFields = () => {
        setNewProduct({
            name: '',
            price: '',
            sellerName: '',
            sellerLocation: '',
            imageFile: null,  // Reset image field after adding
        });
    };

    return (
        <div className="page-container">
            <h2>Products</h2>
            <button onClick={() => setShowAddModal(true)}>Add Product</button>

            <div className="card-grid">
                {products.map((product) => (
                    <Card
                        key={product._id}
                        title={product.name}
                        description={`Price: $${product.price} - Seller: ${product.sellerName}`}
                        onEditClick={() => handleEditClick(product)}
                        onDeleteClick={() => handleDeleteProduct(product._id)}
                        showEditDeleteButtons={true}
                    />
                ))}
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add New Product</h2>
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Seller Name"
                            value={newProduct.sellerName || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, sellerName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Seller Location"
                            value={newProduct.sellerLocation}
                            onChange={(e) => setNewProduct({ ...newProduct, sellerLocation: e.target.value })}
                        />
                        <input
                            type="file"
                            onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })}
                        />
                        <button onClick={handleAddProduct}>Add Product</button>
                        <button onClick={() => setShowAddModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Product</h2>
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={editedProduct.name}
                            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={editedProduct.price}
                            onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Seller Name"
                            value={editedProduct.sellerName}
                            onChange={(e) => setEditedProduct({ ...editedProduct, sellerName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Seller Location"
                            value={editedProduct.sellerLocation}
                            onChange={(e) => setEditedProduct({ ...editedProduct, sellerLocation: e.target.value })}
                        />
                        <input
                            type="file"
                            onChange={(e) => setEditedProduct({ ...editedProduct, imageFile: e.target.files[0] })}
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
