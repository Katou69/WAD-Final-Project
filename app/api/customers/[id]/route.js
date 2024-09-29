import dbConnect from '../../../../lib/db';
import Customer from '../../../../models/Customer';
import { NextResponse } from 'next/server';


export async function GET(req, { params }) {
    await dbConnect();

    const { id } = params;

    try {
        const customer = await Customer.findById(id);
        if (!customer) {
            return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json({ data: customer }, { status: 200 });
    } catch (error) {
        console.error('Error fetching customer:', error);
        return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
    }
}


// DELETE request to delete a customer by ID
export async function DELETE(req, { params }) {
    await dbConnect();
    const { id } = params;

    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Customer deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json({ message: 'Error deleting customer', error: error.message }, { status: 500 });
    }
}



export async function PUT(req, { params }) {
    await dbConnect();

    const { id } = params;  // Get the customer ID from the URL

    try {
        const updateData = await req.json(); // Get updated data from the request body

        // Find the customer by ID and update with new data
        const updatedCustomer = await Customer.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCustomer) {
            return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json({ data: updatedCustomer }, { status: 200 });
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }
}
