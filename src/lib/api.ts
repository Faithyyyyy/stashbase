const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

type ApiOptions = {
  method?: string;
  body?: unknown;
};

export async function api<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("sb_token") : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    const message =
      data.message ||
      data.error ||
      data.data?.message ||
      getStatusMessage(res.status);

    throw new Error(message);
  }

  return data;
}

function getStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return "Invalid request. Please check your details.";
    case 401:
      return "Incorrect email or password.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "Not found.";
    case 409:
      return "An account with this email already exists.";
    case 422:
      return "Please check your details and try again.";
    case 429:
      return "Too many attempts. Please wait a moment and try again.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}
