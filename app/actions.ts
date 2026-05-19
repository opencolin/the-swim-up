"use server";

export type InquiryState =
  | { status: "idle" }
  | { status: "ok"; message: string }
  | { status: "err"; message: string };

export async function inquireMembership(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const email = String(formData.get("email") || "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "err", message: "Enter a valid email." };
  }

  console.log("[membership-inquiry]", email, new Date().toISOString());

  return {
    status: "ok",
    message: "Thanks — we'll be in touch within a week.",
  };
}
