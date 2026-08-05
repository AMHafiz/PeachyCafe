import type { Metadata } from "next";
import { ContactExperience } from "@/components/contact/ContactExperience";

export const metadata: Metadata = {
  title: "Contact | The Peachy",
  description: "Visit The Peachy in Toronto, or send us a cake order and inquiry request -- locations, hours, phone, and email.",
};

export default function ContactPage() {
  return <ContactExperience />;
}
