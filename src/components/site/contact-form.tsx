"use client";

import { FormEvent, useMemo, useState } from "react";

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialValues: ContactPayload = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isDisabled = useMemo(
    () =>
      isSubmitting ||
      !values.name.trim() ||
      !values.email.trim() ||
      !values.message.trim(),
    [isSubmitting, values.email, values.message, values.name]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitted(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Nie udalo sie wyslac formularza.");
      }

      setIsSubmitted(true);
      setValues(initialValues);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Wystapil nieoczekiwany blad."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-[12px] font-semibold text-dark">
          Imie i nazwisko
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, name: event.target.value }))
          }
          className="w-full rounded-xl border border-[#e5dbd7] bg-white px-4 py-2.5 text-[14px] text-dark outline-none transition-colors focus:border-primary"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1 block text-[12px] font-semibold text-dark">
          E-mail
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
          className="w-full rounded-xl border border-[#e5dbd7] bg-white px-4 py-2.5 text-[14px] text-dark outline-none transition-colors focus:border-primary"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-phone" className="mb-1 block text-[12px] font-semibold text-dark">
          Telefon
        </label>
        <input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, phone: event.target.value }))
          }
          className="w-full rounded-xl border border-[#e5dbd7] bg-white px-4 py-2.5 text-[14px] text-dark outline-none transition-colors focus:border-primary"
          placeholder="Opcjonalnie"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-[12px] font-semibold text-dark">
          Wiadomosc
        </label>
        <textarea
          id="contact-message"
          value={values.message}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, message: event.target.value }))
          }
          className="min-h-[110px] w-full resize-y rounded-xl border border-[#e5dbd7] bg-white px-4 py-2.5 text-[14px] text-dark outline-none transition-colors focus:border-primary"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className="w-full rounded-full bg-primary px-6 py-3 text-[12px] font-bold tracking-widest text-white uppercase shadow-md transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "WYSYLANIE..." : "WYSLIJ WIADOMOSC"}
      </button>

      {isSubmitted ? (
        <p className="text-[13px] font-medium text-green-700">
          Dziekujemy! Wiadomosc zostala wyslana.
        </p>
      ) : null}

      {errorMessage ? (
        <p className="text-[13px] font-medium text-red-600">{errorMessage}</p>
      ) : null}
    </form>
  );
}
