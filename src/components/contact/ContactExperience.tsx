"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { Mail, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { generateTimeSlots } from "@/lib/storeHours";
import type { ContactRequestBody } from "@/app/api/contact/route";

const PICKUP_LOCATIONS = [
  { value: "", label: "Select a location" },
  { value: "north-york", label: "North York (Main)" },
  { value: "toronto", label: "Toronto" },
  { value: "general", label: "General Inquiry (no pickup yet)" },
];

const INQUIRY_TYPES = [
  { value: "", label: "Select an inquiry type" },
  { value: "custom-cake", label: "Custom Cake" },
  { value: "catering", label: "Catering" },
  { value: "general", label: "General Question" },
];

interface FormData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  inquiryType: string;
  message: string;
}

const EMPTY_FORM: FormData = {
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  pickupDate: "",
  pickupTime: "",
  pickupLocation: "",
  inquiryType: "",
  message: "",
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[0-9()+\-.\s]{7,}$/;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.firstName.trim()) errors.firstName = "First name is required.";
  if (!data.lastName.trim()) errors.lastName = "Last name is required.";
  if (!data.mobile.trim()) errors.mobile = "Mobile number is required.";
  else if (!MOBILE_PATTERN.test(data.mobile)) errors.mobile = "Enter a valid phone number.";
  if (!data.email.trim()) errors.email = "Email address is required.";
  else if (!EMAIL_PATTERN.test(data.email)) errors.email = "Enter a valid email address.";
  if (!data.pickupDate) errors.pickupDate = "Pickup date is required.";
  if (!data.pickupTime) errors.pickupTime = "Pickup time is required.";
  if (!data.pickupLocation) errors.pickupLocation = "Please select a pickup location.";
  if (!data.inquiryType) errors.inquiryType = "Please select an inquiry type.";
  return errors;
}

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-ink placeholder:text-ink-faint focus:border-peach focus:outline-none";

export function ContactExperience() {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = useId();

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handlePickupDateChange(nextDate: string) {
    // Reset the time whenever the date changes -- a previously chosen slot may
    // no longer be valid (different day's hours, or it's since passed today).
    setFormData((prev) => ({ ...prev, pickupDate: nextDate, pickupTime: "" }));
    setErrors((prev) => ({ ...prev, pickupTime: undefined }));
  }

  const timeSlots = useMemo(() => generateTimeSlots(formData.pickupDate), [formData.pickupDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const payload: ContactRequestBody = formData;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong sending your message.");
      }

      track(ANALYTICS_EVENTS.CONTACT_FORM_SUBMITTED, {
        inquiryType: formData.inquiryType,
        pickupLocation: formData.pickupLocation,
      });
      toast.success("Message sent! We'll follow up shortly.");
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setFormData(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
  }

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-2xl px-4 py-12 lg:py-16">
        <header className="text-center">
          <h1 className="font-serif text-3xl text-ink md:text-4xl">Get in Touch!</h1>
          <p className="mt-2 text-ink-muted">
            Have questions about custom cake orders, catering, or dietary options? Send us a message below.
          </p>
          <div className="mt-4 rounded-xl border border-peach-lighter bg-cream p-4 text-sm text-ink-muted">
            🎂 Cake Orders: Please submit whole cake inquiries at least 2 days in advance.
          </div>
        </header>

        <div className="mt-8 rounded-2xl border border-stone-100 bg-white p-6 shadow-sm md:p-8">
          {submitted ? (
            <div className="flex flex-col items-center py-10 text-center" role="status" aria-live="polite">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-peach/10 text-peach">
                <Mail className="h-7 w-7" aria-hidden="true" />
              </div>
              <p className="mt-4 max-w-sm font-serif text-xl text-ink">
                Thank you! We&apos;ve received your inquiry and will follow up via email shortly.
              </p>
              <button
                type="button"
                onClick={handleReset}
                data-analytics-id="contact-form-reset"
                className="mt-6 flex min-h-11 items-center rounded-full border border-border px-6 text-sm font-medium text-ink transition hover:border-peach hover:text-peach"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate data-analytics-id="contact-form">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="First Name" htmlFor={`${formId}-firstName`} error={errors.firstName}>
                  <input
                    id={`${formId}-firstName`}
                    type="text"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? `${formId}-firstName-error` : undefined}
                    className={inputClass}
                  />
                </Field>

                <Field label="Last Name" htmlFor={`${formId}-lastName`} error={errors.lastName}>
                  <input
                    id={`${formId}-lastName`}
                    type="text"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? `${formId}-lastName-error` : undefined}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Mobile Number" htmlFor={`${formId}-mobile`} error={errors.mobile}>
                  <input
                    id={`${formId}-mobile`}
                    type="tel"
                    autoComplete="tel"
                    value={formData.mobile}
                    onChange={(e) => updateField("mobile", e.target.value)}
                    aria-invalid={!!errors.mobile}
                    aria-describedby={errors.mobile ? `${formId}-mobile-error` : undefined}
                    placeholder="(416) 555-0123"
                    className={inputClass}
                  />
                </Field>

                <Field label="Email Address" htmlFor={`${formId}-email`} error={errors.email}>
                  <input
                    id={`${formId}-email`}
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Pickup Date" htmlFor={`${formId}-pickupDate`} error={errors.pickupDate}>
                  <input
                    id={`${formId}-pickupDate`}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.pickupDate}
                    onChange={(e) => handlePickupDateChange(e.target.value)}
                    aria-invalid={!!errors.pickupDate}
                    aria-describedby={errors.pickupDate ? `${formId}-pickupDate-error` : undefined}
                    className={inputClass}
                  />
                </Field>

                <Field label="Pickup Time" htmlFor={`${formId}-pickupTime`} error={errors.pickupTime}>
                  {formData.pickupDate && timeSlots.length === 0 ? (
                    <div
                      id={`${formId}-pickupTime`}
                      className="flex min-h-12 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm text-amber-800"
                    >
                      <TriangleAlert className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      <span>Ordering is unavailable for that day/time. Please choose another date.</span>
                    </div>
                  ) : (
                    <select
                      id={`${formId}-pickupTime`}
                      value={formData.pickupTime}
                      onChange={(e) => updateField("pickupTime", e.target.value)}
                      disabled={!formData.pickupDate}
                      aria-invalid={!!errors.pickupTime}
                      aria-describedby={errors.pickupTime ? `${formId}-pickupTime-error` : undefined}
                      className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <option value="">{formData.pickupDate ? "Select a time" : "Select a date first"}</option>
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Pickup Location" htmlFor={`${formId}-pickupLocation`} error={errors.pickupLocation}>
                  <select
                    id={`${formId}-pickupLocation`}
                    value={formData.pickupLocation}
                    onChange={(e) => updateField("pickupLocation", e.target.value)}
                    aria-invalid={!!errors.pickupLocation}
                    aria-describedby={errors.pickupLocation ? `${formId}-pickupLocation-error` : undefined}
                    className={inputClass}
                  >
                    {PICKUP_LOCATIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Inquiry Type" htmlFor={`${formId}-inquiryType`} error={errors.inquiryType}>
                  <select
                    id={`${formId}-inquiryType`}
                    value={formData.inquiryType}
                    onChange={(e) => updateField("inquiryType", e.target.value)}
                    aria-invalid={!!errors.inquiryType}
                    aria-describedby={errors.inquiryType ? `${formId}-inquiryType-error` : undefined}
                    className={inputClass}
                  >
                    {INQUIRY_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Special Instructions / Message" htmlFor={`${formId}-message`}>
                  <textarea
                    id={`${formId}-message`}
                    rows={4}
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder="Allergies, dietary restrictions, cake message, or any other questions..."
                    className={`${inputClass} min-h-28 resize-y py-3`}
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                data-analytics-id="contact-form-submit"
                className="mt-8 flex min-h-12 w-full items-center justify-center rounded-full bg-peach py-3 font-medium text-white transition-colors hover:bg-[#e56266] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Submit Inquiry / Order Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
