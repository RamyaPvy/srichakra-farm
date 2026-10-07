"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type CloudImagePickerProps = {
  value?: string | null;
  onUpload: (url: string) => void | Promise<void>;
};

type CloudinaryUpload = {
  secure_url?: string;
  error?: { message?: string };
};

export default function CloudImagePicker({ value, onUpload }: CloudImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const uploadConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );

  async function uploadPhoto(file: File) {
    setMessage(null);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      setMessage("Photo uploads need Cloudinary cloud name and unsigned preset in .env.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage("Choose a photo smaller than 10 MB.");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    formData.set("upload_preset", uploadPreset);
    formData.set("folder", "srichakra-farm/products");

    setUploading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
        { method: "POST", body: formData }
      );
      const result = (await response.json()) as CloudinaryUpload;
      if (!response.ok || !result.secure_url) {
        throw new Error(result.error?.message || "Photo upload failed.");
      }
      await onUpload(result.secure_url);
      setMessage("Photo uploaded and saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Photo upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <Image
            src={value}
            alt="Selected product"
            width={64}
            height={64}
            unoptimized
            className="h-16 w-16 rounded-lg border object-cover"
          />
        ) : null}
        <label className="inline-flex cursor-pointer items-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50">
          {uploading ? "Uploading photo..." : "Take or choose photo"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadPhoto(file);
            }}
          />
        </label>
        <span className="text-xs text-zinc-500">Camera or gallery · max 10 MB</span>
      </div>
      {!uploadConfigured ? (
        <p className="text-xs text-amber-800">
          Configure Cloudinary in .env to save camera photos permanently.
        </p>
      ) : null}
      {message ? (
        <p role="status" className="text-xs text-zinc-600">{message}</p>
      ) : null}
    </div>
  );
}
