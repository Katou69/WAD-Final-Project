import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
import { NextResponse } from 'next/server';


// Handle GET requests to fetch all products
export async function GET() {
    await dbConnect();

    try {
        const products = await Product.find();
        return NextResponse.json({ data: products }, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// Handle POST requests to add a new product
export async function POST(req) {
    await dbConnect();

    try {
        const { name, price, sellerName, sellerLocation } = await req.json();

        // Ensure all required fields are provided
        if (!name || !price || !sellerName || !sellerLocation) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create and save the product
        const newProduct = new Product({
            name,
            price,
            sellerName,
            sellerLocation,
        });

        await newProduct.save();
        return NextResponse.json({ data: newProduct }, { status: 201 });
    } catch (error) {
        console.error('Error adding product:', error);
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}