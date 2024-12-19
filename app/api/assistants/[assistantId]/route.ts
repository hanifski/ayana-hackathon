import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";

export async function GET(
  _req: Request,
  context: { params: { assistantId: string } }
) {
  try {
    // Await the params before using
    const { assistantId } = await context.params;

    // Fetch assistant directly
    const { data, error } = await supabase
      .from("assistants")
      .select("*")
      .eq("id", "13f47026-c182-44fd-9234-80c5f0b68743")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Assistant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
