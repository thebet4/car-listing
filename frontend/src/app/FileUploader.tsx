"use client";

import { useState, useTransition } from "react";
import { uploadFile } from "../actions/uploadFile";
import { toast } from "react-toastify";

export function FileUploader() {
  const [file, setFile] = useState<File>();
  const [invalidEntrancesFile, setInvalidEntrancesFile] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(selectedFile);
      setInvalidEntrancesFile("");
    } else {
      toast.error("Please upload a valid .xlsx file");
      event.target.value = ""; // Reset input
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert file to Base64
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      if (!file) return;
      const buffer = await fileToBase64(file);
      const {
        success,
        message,
        status,
        file: base64,
      } = await uploadFile(buffer);
      console.log({
        success,
        message,
        status,
        base64,
      });
      if (base64) {
        toast.info(message);
        setInvalidEntrancesFile(base64);
      } else if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    });
  };

  const handleDownloadInvalidEntrances = async () => {
    try {
      if (!invalidEntrancesFile) throw new Error("No base64 was provided!");

      const byteCharacters = atob(invalidEntrancesFile);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteNumbers], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "invalid_entraces.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error("Could not download file!");
    }
  };

  return (
    <section>
      <form className="flex flex-col gap-4" onSubmit={handleUpload}>
        <input
          id="file"
          name="file"
          required
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="bg-neutral-900 py-4 px-6 rounded-lg"
        />

        <div className="flex gap-4">
          <button
            disabled={!file}
            type="submit"
            className="bg-foreground text-background px-6 py-2 rounded-lg cursor-pointer"
          >
            {isPending ? <p>Processing…</p> : <p>Upload</p>}
          </button>
          {invalidEntrancesFile && (
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-lg cursor-pointer"
              onClick={handleDownloadInvalidEntrances}
            >
              Download invalid entrances
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
