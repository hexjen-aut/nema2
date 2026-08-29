// app/api/generate-preview/route.ts
//
// Relaie l'appel du Configurator.tsx vers l'Edge Function Supabase.
// Garde la clé service_role côté Edge Function uniquement — jamais ici.

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-preview`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        productId: body.productId,
        materialId: body.materialId,
        materialColorId: body.materialColorId,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error || "Échec de la génération." }, { status: res.status });
  }

  return NextResponse.json(data);
}
