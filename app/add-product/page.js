'use client';

import { useState } from 'react';

export default function AddProductForm() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('image', image);  // Attach image file to formData

        const res = await fetch('/api/products', {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            setName('');
            setPrice('');
            setStock('');
            setImage(null);
        } else {
            console.error('Failed to add product');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name"
                required
            />
            <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                required
            />
            <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stock"
                required
            />
            <input
                type="file"
                onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })}
            />
            
            <button type="submit">Add Product</button>
        </form>
    );
}
