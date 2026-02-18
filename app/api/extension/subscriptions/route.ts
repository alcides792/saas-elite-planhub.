import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("❌ [API] No token");
      return NextResponse.json({ error: 'No token' }, { status: 401, headers: corsHeaders });
    }

    const token = authHeader.replace('Bearer ', '');
    const body = await req.json();


    // 1. Identify User
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('extension_token', token)
      .single();

    if (profileError || !profile) {
      console.error("❌ [API] Profile not found or error:", profileError);
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    // --- DATE CORRECTION ---
    // If date comes as an empty string "", transform to null, otherwise DB rejects
    const renewalDate = body.renewal_date ? body.renewal_date : null;

    // 2. Save Subscription
    const { error: insertError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: profile.id,
        name: body.service_name,
        amount: body.amount,
        currency: body.currency,
        billing_type: body.billing_cycle, // Check if your column is 'billing_type' or 'billing_cycle'
        renewal_date: renewalDate,        // <--- Common error here
        category: body.category,
        website: body.website,
        status: 'active',

      });

    if (insertError) {
      console.error("❌ [API] Supabase insert error:", insertError);
      return NextResponse.json({ ok: false, error: insertError.message }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ ok: true, data: { success: true } }, { headers: corsHeaders });

  } catch (err: any) {
    console.error("❌ [API] Fatal Catch Error:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}