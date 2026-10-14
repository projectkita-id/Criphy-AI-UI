const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export type UserRole = "ADMIN" | "STUDENT";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export async function login(
  email: string,
  password: string
): Promise<AuthUser> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke server. Silakan coba lagi."
    );
  }

  const result: ApiResponse<AuthUser> = await response.json();

  if (!response.ok || !result.success || !result.data) {
    if (response.status === 429) {
      throw new Error(
        "Terlalu banyak percobaan masuk. Silakan coba lagi nanti."
      );
    }

    if (response.status === 401) {
      throw new Error("Email atau kata sandi salah.");
    }

    throw new Error(result.message || "Gagal masuk.");
  }

  return result.data;
}


export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function register(
  input: RegisterInput
): Promise<AuthUser> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke server. Silakan coba lagi."
    );
  }

  let result: ApiResponse<AuthUser>;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "Respons server tidak valid. Silakan coba lagi."
    );
  }

  if (!response.ok || !result.success || !result.data) {
    if (response.status === 409) {
      throw new Error(
        "Email sudah terdaftar. Silakan gunakan email lain."
      );
    }

    if (response.status === 429) {
      throw new Error(
        "Terlalu banyak percobaan pendaftaran. Silakan coba lagi nanti."
      );
    }

    if (response.status === 400) {
      throw new Error(
        "Data pendaftaran tidak valid. Periksa kembali formulir."
      );
    }

    throw new Error(
      result.message || "Pendaftaran gagal. Silakan coba lagi."
    );
  }

  return result.data;
}
