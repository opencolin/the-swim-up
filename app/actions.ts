"use server";

export type InquiryState =
  | { status: "idle" }
  | { status: "ok"; message: string }
  | { status: "err"; message: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function deliverInquiry(email: string) {
  const webhookUrl = process.env.INQUIRY_WEBHOOK_URL;
  if (!webhookUrl) return;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email,
      submittedAt: new Date().toISOString(),
      source: "poolbar-membership-form",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to deliver inquiry");
  }
}

export async function inquireMembership(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email || !EMAIL_REGEX.test(email)) {
    return { status: "err", message: "Enter a valid email." };
  }
  try {
    await deliverInquiry(email);
  } catch {
    return {
      status: "err",
      message: "Couldn’t submit right now. Please try again in a minute.",
    };
  }

  return {
    status: "ok",
    message: "Thanks — we'll be in touch within a week.",
  };
}
