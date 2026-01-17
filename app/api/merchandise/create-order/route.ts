import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
            { error: "Razorpay credentials not configured" },
            { status: 500 }
        );
    }

    const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
    });

    try {
        const { product_id, size, quantity, user_id } = await request.json();

        // Validate inputs
        if (!product_id || !size || !quantity) {
            return NextResponse.json(
                { error: "product_id, size, and quantity are required" },
                { status: 400 }
            );
        }

        // Fetch product from database to get actual price
        const { data: product, error } = await supabase
            .from("merchandise_management")
            .select("product_id, product_name, price, is_available")
            .eq("product_id", product_id)
            .eq("is_available", true)
            .single();

        if (error || !product) {
            return NextResponse.json(
                { error: "Product not found or unavailable" },
                { status: 404 }
            );
        }

        // Validate product price
        if (product.price === null || product.price === undefined) {
            return NextResponse.json(
                { error: "Product price not available" },
                { status: 400 }
            );
        }

        // Calculate total amount
        const totalAmount = product.price * quantity;
        const amountInPaise = totalAmount * 100;

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `merch_${product_id}_${Date.now()}`,
            notes: {
                product_id: product_id.toString(),
                product_name: product.product_name,
                size,
                quantity: quantity.toString(),
                user_id: user_id || "guest",
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: amountInPaise,
            currency: "INR",
            product: {
                id: product.product_id,
                name: product.product_name,
                price: product.price,
            },
            quantity,
            size,
        });
    } catch (error: unknown) {
        console.error("Merchandise Order Create Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
