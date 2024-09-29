import dbConnect from '../../../../lib/db';
import Product from '../../../../models/Product';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// DELETE request to delete a product by ID
export async function DELETE(req, { params }) {
    await dbConnect();
    const { id } = params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ message: 'Error deleting product', error: error.message }, { status: 500 });
    }
}



export async function PUT(req, { params }) {
    await dbConnect();

    const { id } = params;  // Get the product ID from the URL

    try {
        const formData = await req.formData();  // Extract FormData from request
        const updateData = {
            name: formData.get('name'),
            price: formData.get('price'),
            sellerName: formData.get('sellerName'),
            sellerLocation: formData.get('sellerLocation'),
        };

        const imageFile = formData.get('image');
        if (imageFile) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const fileName = `${Date.now()}_${imageFile.name}`;
            const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

            fs.writeFileSync(filePath, buffer);  // Save the image file to disk
            updateData.image = `/uploads/${fileName}`;  // Update the image URL
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ data: updatedProduct }, { status: 200 });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function POST(req) {
    await dbConnect();

    try {
        const formData = await req.formData();
        const name = formData.get('name');
        const price = formData.get('price');
        const sellerName = formData.get('sellerName');
        const sellerLocation = formData.get('sellerLocation');
        const imageFile = formData.get('image');

        // If there's an image file, handle the file upload
        let imageUrl = '';
        if (imageFile) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const fileName = `${Date.now()}_${imageFile.name}`;
            const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

            fs.writeFileSync(filePath, buffer);  // Save the image file to disk
            imageUrl = `/uploads/${fileName}`;  // Store the relative image URL
        }

        // Create and save the product
        const newProduct = new Product({
            name,
            price,
            sellerName,
            sellerLocation,
            image: imageUrl || '',  // Store image URL or leave it empty
        });

        await newProduct.save();
        return NextResponse.json({ data: newProduct }, { status: 201 });
    } catch (error) {
        console.error('Error adding product:', error);
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}