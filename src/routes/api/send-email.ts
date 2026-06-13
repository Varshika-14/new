import { sendMail } from "@/lib/email/sendMail";

export async function POST(request: Request) {
  const body = await request.json();

  await sendMail(
    body.email,
    "AshaAI Notification",
    `
      <h2>Hello!</h2>
      <p>${body.message}</p>
    `
  );

  return Response.json({
    success: true,
  });
}
