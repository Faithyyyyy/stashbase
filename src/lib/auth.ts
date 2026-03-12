import { api } from "./api";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  success: boolean;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
};

// export async function register(payload: {
//   email: string;
//   password: string;
//   displayName: string;
// }): Promise<AuthResponse> {
//   return api<AuthResponse>("/api/auth/register", {
//     method: "POST",
//     body: payload,
//   });
// }

// export async function login(payload: {
//   email: string;
//   password: string;
// }): Promise<AuthResponse> {
//   return api<AuthResponse>("/api/auth/login", {
//     method: "POST",
//     body: payload,
//   });
// }

export async function register(payload: {
  email: string;
  password: string;
  displayName: string;
}): Promise<AuthResponse> {
  const res = await api<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
  localStorage.setItem("sb_token", res.data.accessToken);
  localStorage.setItem("sb_user", JSON.stringify(res.data.user));
  return res;
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await api<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
  localStorage.setItem("sb_token", res.data.accessToken);
  localStorage.setItem("sb_refresh_token", res.data.refreshToken);
  localStorage.setItem("sb_user", JSON.stringify(res.data.user)); // ← is this line here?
  return res;
}

export async function logout(): Promise<void> {
  await api("/api/auth/logout", { method: "POST" });
}
