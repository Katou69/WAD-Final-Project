// models/Customer.js

import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Optional: if you want unique emails
    },
    address: {
        type: String,
        required: true,
    },
});

const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
export default Customer;
