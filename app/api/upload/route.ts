import { AwsClient } from "aws4fetch";
import { NextRequest, NextResponse } from "next/server";

const S3_ENDPOINT = (process.env.S3_ENDPOINT ?? "").trim();
const ACCESS_KEY_ID = (process.env.ACCESS_KEY_ID ?? "").trim();
const SECRET_ACCESS_KEY = (process.env.SECRET_ACCESS_KEY ?? "").trim();

// Derive the Supabase project ref from the S3 endpoint URL so we can build
// the public object URL.  The endpoint looks like:
//   https://<ref>.storage.supabase.co/storage/v1/s3
const projectRef = (() => {
  try {
    const host = new URL(S3_ENDPOINT).hostname; // <ref>.storage.supabase.co
    return host.split(".")[0];
  } catch {
    return "";
  }
})();

// The bucket that holds story cover images.  The bucket must exist in your
// Supabase project and be set to "public" so the generated URL is accessible.
const BUCKET = "story-images";

function publicUrl(objectKey: string): string {
  return `https://${projectRef}.supabase.co/storage/v1/object/public/${BUCKET}/${objectKey}`;
}

export async function POST(request: NextRequest) {
  if (!S3_ENDPOINT || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    return NextResponse.json(
      { error: "Storage credentials are not configured." },
      { status: 500 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Could not read the upload. Choose the image again and retry." },
      { status: 400 },
    );
  }
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No file provided. Send a multipart/form-data request with a 'file' field." },
      { status: 400 },
    );
  }

  // Validate: images only, max 10 MB
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are supported." },
      { status: 400 },
    );
  }

  const MAX_BYTES = 10 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 10 MB." },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const objectKey = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  // S3_ENDPOINT ends with /s3; the S3 PutObject path is /{bucket}/{key}
  const s3BaseUrl = S3_ENDPOINT.replace(/\/+$/, "");
  const uploadUrl = `${s3BaseUrl}/${BUCKET}/${objectKey}`;

  const aws = new AwsClient({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    service: "s3",
    region: "auto",
  });

  const body = await file.arrayBuffer();

  let response: Response;
  try {
    response = await aws.fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not connect to image storage. Please try again." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const code = text.match(/<Code>([^<]+)<\/Code>/i)?.[1];
    const message = text.match(/<Message>([^<]+)<\/Message>/i)?.[1];
    console.error("Supabase S3 upload failed:", response.status, code ?? "unknown error");
    return NextResponse.json(
      {
        error: message
          ? `Storage rejected the image (${code ?? response.status}): ${message}`
          : `Storage rejected the image (${code ?? response.status}). Check the storage bucket and credentials.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: publicUrl(objectKey) });
}
