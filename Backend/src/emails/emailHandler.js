import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplate.js";
// import { Resend } from "resend";

export const sendWelcomeEmail = async(email, name, clientURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name}  <${sender.email}>`,
        to: email,
        subject: 'Welcome to ChatterBox',
        html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome Email sent successfully", data);
}