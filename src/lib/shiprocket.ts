/**
 * Shiprocket API Client with token caching & dynamic tracking/order generation
 */
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getShiprocketToken(): Promise<string | null> {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  const baseUrl =
    process.env.SHIPROCKET_API_BASE_URL || "https://apiv2.shiprocket.in/v1/external";

  if (!email || !password) {
    console.warn("Shiprocket credentials not provided in environment variables");
    return null;
  }

  // Return cached token if valid (expires in 10 days, refresh after 9 days)
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error(`Shiprocket auth failed with status: ${res.status}`);
    }

    const data = await res.json();
    cachedToken = data.token;
    tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;
    return cachedToken;
  } catch (error) {
    console.error("Error fetching Shiprocket token:", error);
    return null;
  }
}

export async function trackShipmentAWB(awb: string) {
  const token = await getShiprocketToken();
  const baseUrl =
    process.env.SHIPROCKET_API_BASE_URL || "https://apiv2.shiprocket.in/v1/external";

  if (!token) return null;

  try {
    const res = await fetch(`${baseUrl}/courier/track/awb/${awb}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    console.error("Error tracking AWB:", err);
    return null;
  }
}
