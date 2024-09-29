import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to Product model
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Reference to Customer model
    quantity: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
