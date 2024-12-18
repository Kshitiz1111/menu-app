import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse } from "axios";

interface PaymentPayload {
  return_url: string;
  website_url: string;
  amount: number;
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
}

interface KhaltiResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload: PaymentPayload = body;

    const response: AxiosResponse<KhaltiResponse> = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: "Key faec6057a16449a6ae2866e07b2935f6",
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include credentials if needed for cross-origin requests
      }
    );

    // Return the response data to the client
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error initiating Khalti payment:", error.message);

    if (error.response) {
      // Forward the exact error from the Khalti API if available
      return res.status(error.response.status).json({ error: error.response.data });
    }

    // Return a generic error if no specific response is available
    res.status(500).json({ error: "Failed to initiate payment" });
  }
}
