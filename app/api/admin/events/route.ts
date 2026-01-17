// eg api call
// {
//   "event_name": "Hackathon 2025",
//   "category_id": 1,
//   "event_date": "2025-12-20T09:00:00.000Z",
//   "is_registration_open": true,
//   "is_dau_free": true,
//   "fees": [
//     {
//       "type": "solo",
//       "price": 100,
//       "min": 1,
//       "max": 1
//     },
//     {
//       "type": "duet",
//       "price": 200,
//       "min": 2,
//       "max": 2
//     }
//   ]
// }


import { checkAdminFromRequest } from '@/lib/checkAdmin'
import { corsHeaders, handleCorsResponse, addCorsHeaders } from '@/lib/cors'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { uploadImage, deleteImage } from '@/lib/imageUtil'

async function checkAdmin(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  return user.email === process.env.ADMIN_EMAIL;
}

// Handle CORS preflight requests
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return handleCorsResponse(origin);
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event")
    .select(
      `
      *,
      event_category ( category_name ),
      event_fee (
        fee ( fee_id, participation_type, price, min_members, max_members )
      )
    `
    )
    .order("event_date", { ascending: true });

  if (error) {
    const response = NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
    return addCorsHeaders(response, origin);
  }

  const response = NextResponse.json({ events: data });
  return addCorsHeaders(response, origin);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const supabase = (await createClient()) as any;

  if (!(await checkAdmin(supabase))) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    return addCorsHeaders(response, origin);
  }

  try {
    const formData = await request.formData()

    const event_name = formData.get('event_name') as string
    const category_id = formData.get('category_id') as string
    const event_date = formData.get('event_date') as string
    const rulebook = formData.get('rulebook') as string | null
    const description = formData.get('description') as string | null
    const is_registration_open = formData.get('is_registration_open') === 'true'
    const is_dau_free = formData.get('is_dau_free') === 'true'
    const imageFile = formData.get('image') as File | null
    const feesJson = formData.get('fees') as string | null

    let event_picture = null

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadImage({
        file: imageFile,
        bucket: 'synapse',
        folder: 'events'
      })
      event_picture = uploadResult.publicUrl
    }

    // A. Create the Event
    const { data: eventData, error: eventError } = await supabase
      .from("event")
      .insert({
        event_name,
        category_id: Number(category_id),
        event_date,
        event_picture,
        rulebook: rulebook || null,
        description: description || null,
        is_registration_open,
        is_dau_free
      })
      .select()
      .single()

    if (eventError) throw eventError

    // Parse fees from JSON string
    const fees = feesJson ? JSON.parse(feesJson) : []

    if (fees && Array.isArray(fees) && fees.length > 0) {

      const feeInserts = fees.map((f: any) => ({
        participation_type: f.type,
        price: Number(f.price),
        min_members: Number(f.min || 1),
        max_members: Number(f.max || 1),
      }));

      const { data: feeData, error: feeError } = await supabase
        .from("fee")
        .insert(feeInserts)
        .select();

      if (feeError) throw feeError;

      const eventFeeLinks = feeData.map((f: any) => ({
        event_id: eventData.event_id,
        fee_id: f.fee_id,
      }));

      const { error: linkError } = await supabase
        .from("event_fee")
        .insert(eventFeeLinks);

      if (linkError) throw linkError;
    }

    const response = NextResponse.json(
      { success: true, event: eventData },
      { status: 201 }
    );
    return addCorsHeaders(response, origin);
  } catch (error: any) {
    console.error("Create Error:", error);
    const response = NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
    return addCorsHeaders(response, origin);
  }
}

export async function PUT(request: Request) {
  const origin = request.headers.get("origin");
  const supabase = (await createClient()) as any;

  if (!(await checkAdmin(supabase))) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    return addCorsHeaders(response, origin);
  }

  try {
    const body = await request.json();
    const { event_id, fees, ...updates } = body;

    if (!event_id) {
      const response = NextResponse.json(
        { error: "Event ID required" },
        { status: 400 }
      );
      return addCorsHeaders(response, origin);
    }

    const { data: eventData, error: eventError } = await supabase
      .from("event")
      .update(updates)
      .eq("event_id", Number(event_id))
      .select()
      .single();

    if (eventError) throw eventError;

    if (fees && Array.isArray(fees)) {
      // 1. Find old fees linked to this event
      const { data: oldLinks } = await supabase
        .from("event_fee")
        .select("fee_id")
        .eq("event_id", Number(event_id));

      const oldFeeIds = oldLinks?.map((link: any) => link.fee_id) || [];

      if (oldFeeIds.length > 0) {
        await supabase.from("fee").delete().in("fee_id", oldFeeIds);
      }

      // 3. Create NEW fees from the form data
      if (fees.length > 0) {
        const feeInserts = fees.map((f: any) => ({
          participation_type: f.type,
          price: Number(f.price),
          min_members: Number(f.min || 1),
          max_members: Number(f.max || 1),
        }));

        const { data: newFees, error: newFeeError } = await supabase
          .from("fee")
          .insert(feeInserts)
          .select();

        if (newFeeError) throw newFeeError;

        const newLinks = newFees.map((f: any) => ({
          event_id: event_id,
          fee_id: f.fee_id,
        }));

        await supabase.from("event_fee").insert(newLinks);
      }
    }

    const response = NextResponse.json({ success: true, event: eventData });
    return addCorsHeaders(response, origin);
  } catch (error: any) {
    const response = NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
    return addCorsHeaders(response, origin);
  }
}

export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  const supabase = (await createClient()) as any;

  if (!(await checkAdmin(supabase))) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    return addCorsHeaders(response, origin);
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      const response = NextResponse.json(
        { error: "ID required" },
        { status: 400 }
      );
      return addCorsHeaders(response, origin);
    }

    // Get the event to retrieve the image path
    const { data: event } = await supabase
      .from('event')
      .select('event_picture')
      .eq('event_id', Number(id))
      .single()

    // Delete the event from database
    const { error } = await supabase
      .from('event')
      .delete()
      .eq('event_id', Number(id))

    if (error) throw error

    // Delete the image from storage if it exists
    if (event?.event_picture) {
      try {
        // Extract the file path from the public URL
        const url = new URL(event.event_picture)
        const pathParts = url.pathname.split('/storage/v1/object/public/synapse/')
        if (pathParts.length > 1) {
          const filePath = pathParts[1]
          await deleteImage({
            bucket: 'synapse',
            filePath
          })
        }
      } catch (imgError) {
        console.error('Failed to delete image:', imgError)
        // Continue even if image deletion fails
      }
    }

    const response = NextResponse.json({ success: true });
    return addCorsHeaders(response, origin);
  } catch (error: any) {
    const response = NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
    return addCorsHeaders(response, origin);
  }
}
