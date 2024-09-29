import dbConnect from '../../../../lib/db';
import Order from '../../../../models/Order';
import { NextResponse } from 'next/server';

// DELETE request to delete an order by ID
export async function DELETE(req, { params }) {
    await dbConnect();
    const { id } = params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json({ message: 'Error deleting order', error: error.message }, { status: 500 });
    }
}

// Handle PUT request to update an order's quantity
export async function PUT(req, { params }) {
    await dbConnect();
    const { id } = params;
    const { quantity } = await req.json();  // Expect only quantity in the request body

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { quantity }, { new: true });

        if (!updatedOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ data: updatedOrder }, { status: 200 });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order', message: error.message }, { status: 500 });
    }
}