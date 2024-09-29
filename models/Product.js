import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sellerName: {
        type: String,
        required: true,
    },
    sellerLocation: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',  // Optional image field
    }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

