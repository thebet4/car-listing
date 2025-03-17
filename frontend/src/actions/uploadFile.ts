"use server";

import { UploadCarList } from "@/services/car";

export async function uploadFile(buffer: string) {
  try {
    const base64Data = buffer.split(";base64,").pop();
    if (!base64Data) throw new Error("Invalid Base64 format");

    const {message, statusCode, file} = await UploadCarList(base64Data)
    return {
      status: statusCode,
      success: true,
      message: message,
      file: file
    };
  } catch (error){
    return {
      status: 502,
      success: false,
      message: "Internal Server Error",
      error
    };
  }
}
