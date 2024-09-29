import dbConnect from '../../../../lib/db';
import Product from '../../../../models/Product';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Handle image upload
export async function POST(req, { params }) {
    await dbConnect();
    const { id } = params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const formData = await req.formData();
        const imageFile = formData.get('image');

        if (imageFile) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const fileName = `${Date.now()}_${imageFile.name}`;
            const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

            // Ensure the uploads directory exists
            if (!fs.existsSync(path.join(process.cwd(), 'public', 'uploads'))) {
                fs.mkdirSync(path.join(process.cwd(), 'public', 'uploads'), { recursive: true });
            }

            fs.writeFileSync(filePath, buffer);  // Save the image file
            product.image = `/uploads/${fileName}`;
            await product.save();
        }

        return NextResponse.json({ message: 'Image uploaded successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}