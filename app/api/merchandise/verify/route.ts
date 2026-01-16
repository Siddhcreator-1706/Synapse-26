import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const { RAZORPAY_KEY_SECRET } = process.env;

    if (!RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
            { error: "Razorpay secret not configured" },
            { status: 500 }
        );
    }

    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            product_id,
            size,
            quantity,
            user_id,
            amount,
        } = await request.json();

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { success: false, error: "Invalid signature" },
                { status: 400 }
            );
        }

        // Fetch product details
        const { data: product } = await supabase
            .from("merchandise_management")
            .select("product_name, price")
            .eq("product_id", product_id)
            .single();

        // Create order record
        const orderData = {
            customer_id: user_id || "guest",
            items: quantity, // Store the quantity as item count
            amount: amount / 100, // Convert from paise to rupees
            order_date: new Date().toISOString(),
            payment_status: "done" as const, // Use the enum value from schema
            payment_method: "Razorpay",
        };

        const { data: order, error } = await supabase
            .from("merchandise_orders")
            .insert(orderData)
            .select()
            .single();

        if (error) {
            console.error("Error creating order:", error);
            // Payment was successful, but order creation failed
            // Still return success but log for manual handling
            return NextResponse.json({
                success: true,
                warning: "Payment successful but order record failed. Please contact support.",
                payment_id: razorpay_payment_id,
            });
        }

        return NextResponse.json({
            success: true,
            order_id: order.order_id,
            message: "Payment verified and order created successfully",
        });
    } catch (error: unknown) {
        console.error("Payment Verification Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
