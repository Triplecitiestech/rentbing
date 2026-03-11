import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import sharp from "sharp";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ADMIN_KEY = process.env.ADMIN_API_KEY;
const BUCKET = "property-images";
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB (HEIC can be large)
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

function isAuthorized(request: NextRequest): boolean {
  if (!ADMIN_KEY) return false;
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  return authHeader === `Bearer ${ADMIN_KEY}`;
}

// GET: List images for a property
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("property_id");

  if (!propertyId) {
    return NextResponse.json(
      { error: "property_id is required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("property_images")
    .select("id, image_url, alt_text, sort_order")
    .eq("property_id", propertyId)
    .order("sort_order");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ images: data });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const propertyId = formData.get("property_id") as string;
    const files = formData.getAll("images") as File[];

    if (!propertyId) {
      return NextResponse.json(
        { error: "property_id is required" },
        { status: 400 }
      );
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Ensure storage bucket exists (idempotent — no-ops if already created)
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE,
      allowedMimeTypes: ALLOWED_TYPES,
    });

    // Verify property exists
    const { data: property, error: propError } = await supabase
      .from("properties")
      .select("id, title")
      .eq("id", propertyId)
      .single();

    if (propError || !property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Get current max sort_order for this property
    const { data: existingImages } = await supabase
      .from("property_images")
      .select("sort_order")
      .eq("property_id", propertyId)
      .order("sort_order", { ascending: false })
      .limit(1);

    let nextSortOrder = (existingImages?.[0]?.sort_order ?? -1) + 1;

    const uploaded: { id: string; image_url: string; sort_order: number }[] =
      [];
    const errors: string[] = [];

    for (const file of files) {
      const fileName = file.name || "unnamed";

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${fileName}: exceeds 20MB limit`);
        continue;
      }

      // Validate type (check both MIME and extension for HEIC)
      const isHeic =
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        fileName.toLowerCase().endsWith(".heic") ||
        fileName.toLowerCase().endsWith(".heif");
      const isAllowedType =
        ALLOWED_TYPES.includes(file.type) || isHeic;

      if (!isAllowedType) {
        errors.push(`${fileName}: unsupported type "${file.type}"`);
        continue;
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer());

        // Convert to JPEG using sharp (handles HEIC, PNG, WebP, etc.)
        const processed = await sharp(buffer)
          .rotate() // auto-rotate based on EXIF
          .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true })
          .toBuffer();

        // Generate unique filename
        const hash = crypto.randomBytes(8).toString("hex");
        const storagePath = `${propertyId}/${hash}.jpg`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, processed, {
            contentType: "image/jpeg",
            upsert: false,
          });

        if (uploadError) {
          errors.push(`${fileName}: upload failed — ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

        // Insert into property_images table
        const { data: imageRecord, error: insertError } = await supabase
          .from("property_images")
          .insert({
            property_id: propertyId,
            image_url: publicUrl,
            alt_text: `${property.title} photo`,
            sort_order: nextSortOrder,
            source: "upload",
          })
          .select("id, image_url, sort_order")
          .single();

        if (insertError) {
          errors.push(`${fileName}: DB insert failed — ${insertError.message}`);
          continue;
        }

        uploaded.push(imageRecord);
        nextSortOrder++;
      } catch (err) {
        errors.push(
          `${fileName}: processing failed — ${err instanceof Error ? err.message : "unknown error"}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      uploaded,
      errors: errors.length > 0 ? errors : undefined,
      message: `${uploaded.length} of ${files.length} images uploaded`,
    });
  } catch (err) {
    console.error("Image upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove an image by ID
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("id");

    if (!imageId) {
      return NextResponse.json(
        { error: "Image id is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Get image record to find the storage path
    const { data: image, error: fetchError } = await supabase
      .from("property_images")
      .select("id, image_url, property_id")
      .eq("id", imageId)
      .single();

    if (fetchError || !image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Extract storage path from URL
    const url = new URL(image.image_url);
    const pathMatch = url.pathname.match(
      /\/storage\/v1\/object\/public\/property-images\/(.+)/
    );

    if (pathMatch) {
      await supabase.storage.from(BUCKET).remove([pathMatch[1]]);
    }

    // Delete from DB
    const { error: deleteError } = await supabase
      .from("property_images")
      .delete()
      .eq("id", imageId);

    if (deleteError) {
      return NextResponse.json(
        { error: `Delete failed: ${deleteError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, deleted: imageId });
  } catch (err) {
    console.error("Image delete error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Reorder images
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { order } = body as { order: { id: string; sort_order: number }[] };

    if (!Array.isArray(order) || order.length === 0) {
      return NextResponse.json(
        { error: "order array is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    for (const item of order) {
      const { error } = await supabase
        .from("property_images")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id);

      if (error) {
        return NextResponse.json(
          { error: `Failed to update ${item.id}: ${error.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Image reorder error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
