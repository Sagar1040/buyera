import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Handle multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const files = formData.getAll("files") as File[];

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      // Handle single file
      if (file && file instanceof File) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize and create unique filename
        const originalName = file.name || "image.png";
        const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
        const ext = path.extname(cleanName) || ".png";
        const baseName = path.basename(cleanName, ext);
        const fileName = `${baseName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;

        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);

        const fileUrl = `/uploads/${fileName}`;

        return NextResponse.json({
          success: true,
          message: "Image uploaded successfully.",
          url: fileUrl,
          name: originalName,
          size: file.size,
          type: file.type,
        });
      }

      // Handle multiple files
      if (files && files.length > 0) {
        const uploadedUrls: string[] = [];

        for (const f of files) {
          if (f instanceof File) {
            const bytes = await f.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const originalName = f.name || "image.png";
            const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
            const ext = path.extname(cleanName) || ".png";
            const baseName = path.basename(cleanName, ext);
            const fileName = `${baseName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;

            const filePath = path.join(uploadDir, fileName);
            await fs.writeFile(filePath, buffer);
            uploadedUrls.push(`/uploads/${fileName}`);
          }
        }

        return NextResponse.json({
          success: true,
          message: `${uploadedUrls.length} images uploaded successfully.`,
          urls: uploadedUrls,
          url: uploadedUrls[0] || "",
        });
      }

      return NextResponse.json(
        { success: false, error: "No file provided in form data." },
        { status: 400 }
      );
    }

    // 2. Handle JSON payload (Base64 image)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { image, base64, filename } = body;
      const dataString = image || base64;

      if (!dataString) {
        return NextResponse.json(
          { success: false, error: "No base64 image data provided." },
          { status: 400 }
        );
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      // Match base64 header (e.g. data:image/png;base64,...)
      const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let ext = ".png";

      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = ".jpg";
        else if (mimeType.includes("png")) ext = ".png";
        else if (mimeType.includes("webp")) ext = ".webp";
        else if (mimeType.includes("gif")) ext = ".gif";
        else if (mimeType.includes("svg")) ext = ".svg";

        buffer = Buffer.from(matches[2], "base64");
      } else {
        // Raw base64
        buffer = Buffer.from(dataString, "base64");
      }

      const cleanFilename = (filename || "image").replace(/[^a-zA-Z0-9.-]/g, "_");
      const baseName = path.basename(cleanFilename, path.extname(cleanFilename));
      const fileName = `${baseName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;

      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      const fileUrl = `/uploads/${fileName}`;

      return NextResponse.json({
        success: true,
        message: "Base64 image uploaded successfully.",
        url: fileUrl,
      });
    }

    return NextResponse.json(
      { success: false, error: "Unsupported Content-Type header." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Admin upload API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image." },
      { status: 500 }
    );
  }
}
