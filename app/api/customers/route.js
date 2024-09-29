// /app/api/customers/route.js
import dbConnect from '../../../lib/db';
import Customer from '../../../models/Customer';
import { NextResponse } from 'next/server';

// Handle GET requests to fetch all customers
export async function GET() {
    await dbConnect();

    try {
        const customers = await Customer.find();
        return NextResponse.json({ data: customers }, { status: 200 });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}

// Handle POST requests to add a new customer
export async function POST(req) {
    await dbConnect();

    try {
        const { name, phone, email, address } = await req.json();
        
        // Validate input fields
        if (!name || !phone || !email || !address) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        const newCustomer = new Customer({ name, phone, email, address });
        await newCustomer.save();
        
        return NextResponse.json({ data: newCustomer }, { status: 201 });
    } catch (error) {
        console.error("Error adding customer:", error);
        return NextResponse.json({ error: 'Failed to add customer' }, { status: 500 });
    }
}


// Handle DELETE requests to delete a customer by ID
export async function DELETE(req) {
    const { pathname } = new URL(req.url); // Get the request URL
    const id = pathname.split('/').pop(); // Extract the ID from the URL

    await dbConnect();

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

export async function PUT(req) {
    await dbConnect();

    // Extract the ID from the request URL
    const { pathname } = new URL(req.url); 
    const id = pathname.split('/').pop(); // Extract ID from the URL

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