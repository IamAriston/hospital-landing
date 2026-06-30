"use client";

import * as React from "react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/actions/uploads";

type Options = {
  folder?: string;
  onSuccess?: (url: string) => void;
};

export function useUpload({ folder = "uploads", onSuccess }: Options = {}) {
  const [uploading, setUploading] = React.useState(false);
  const [url, setUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const upload = React.useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const result = await uploadImage(fd);
      setUploading(false);
      if (!result.ok) {
        setError(result.error);
        toast.error(`Upload failed: ${result.error}`);
        return null;
      }
      setUrl(result.data.url);
      onSuccess?.(result.data.url);
      return result.data.url;
    },
    [folder, onSuccess],
  );

  return { upload, uploading, url, error, setUrl };
}
