import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';
import { NextResponse } from 'next/server';

// Handle GET requests to fetch all orders

export async function GET() {
    await dbConnect();

    try {
        // Fetch orders and populate productId and customerId
        const orders = await Order.find()
            .populate({ path: 'productId', select: 'name' })  // Only select the 'name' field from Product
            .populate({ path: 'customerId', select: 'name' }); // Only select the 'name' field from Customer

        return NextResponse.json({ data: orders || [] }, { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders', message: error.message }, { status: 500 });
    }
}

// Handle POST requests to create a new order
export async function POST(req) {
    await dbConnect();

    try {
        const { customerId, productId, quantity } = await req.json();

        // Validate input fields
        if (!customerId || !productId || !quantity) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        // Ensure valid ObjectId references
        const newOrder = new Order({
            customerId,
            productId,
            quantity,
        });

        // Save the order to the database
        await newOrder.save();

        return NextResponse.json({ data: newOrder }, { status: 201 });
    } catch (error) {
        console.error('Error adding order:', error);
        return NextResponse.json({ error: 'Failed to add order' }, { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    const { id } = params;
    
    try {
        await dbConnect();
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
