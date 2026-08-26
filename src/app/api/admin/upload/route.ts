import { NextResponse } from "next/server";
import { uploadToSupabase, deleteFromSupabase } from "@/lib/supabase-storage";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400 }
      );
    }

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToSupabase(
      buffer,
      folder,
      file.name,
      file.type || "image/jpeg"
    );

    if (!result.success || !result.url) {
      return NextResponse.json(
        { success: false, error: result.error || "Upload failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
    });
  } catch (error: any) {
    console.error("Admin upload API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { success: false, error: "No URL provided to delete." },
        { status: 400 }
      );
    }

    const result = await deleteFromSupabase(url);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete file." },
      { status: 500 }
    );
  }
}
