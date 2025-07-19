import axios from "axios";
import { ApiError } from "@/exception/ApiError.ts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function searchBooks(query: string, max = 4, threshold = 0.4) {
  try {
    const response = await axios.get(`${BASE_URL}/books`, {
      params: { q: query, max, threshold },
      headers: { Accept: "application/json" },
    });

    return response.data.data;
  } catch (error: any) {
    console.error("Gagal fetch buku:", error);

    const message = error.response?.data?.message || "Gagal mengambil data buku";
    const statusCode = error.response?.status || 500;
    const errors = error.response?.data?.errors || "Terjadi kesalahan jaringan atau server";

    throw new ApiError(message, statusCode, errors);
  }
}
