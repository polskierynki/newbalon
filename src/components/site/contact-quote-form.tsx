"use client";

import { FormEvent, useState } from "react";

type QuotePayload = {
  fullName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  budget: string;
  message: string;
};

export type QuoteFormConfig = {
  fullNamePlaceholder: string;
  phonePlaceholder: string;
  emailPlaceholder: string;
  eventPlaceholder: string;
  eventOptions: string[];
  budgetPlaceholder: string;
  budgetOptions: string[];
  messagePlaceholder: string;
  submitLabel: string;
  successMessage: string;
};

export const defaultQuoteFormConfig: QuoteFormConfig = {
  fullNamePlaceholder: "Imie i Nazwisko *",
  phonePlaceholder: "Telefon *",
  emailPlaceholder: "Twoj email *",
  eventPlaceholder: "Rodzaj imprezy",
  eventOptions: [
    "Urodziny / Impreza prywatna",
    "Slub i Wesele",
    "Event Firmowy",
    "Grab & Go (Odbior osobisty)",
    "Inne",
  ],
  budgetPlaceholder: "Zakladany budzet",
  budgetOptions: [
    "150 zl - 500 zl (Grab & Go)",
    "500 zl - 1500 zl",
    "1500 zl - 3000 zl",
    "Powyzej 3000 zl",
  ],
  messagePlaceholder: "Opisz swoja wizje...",
  submitLabel: "Wyslij Zapytanie",
  successMessage: "Dziekujemy! Wyslalas/Wyslales zapytanie.",
};

const initialValues: QuotePayload = {
  fullName: "",
  phone: "",
  email: "",
  eventType: "",
  eventDate: "",
  budget: "",
  message: "",
};

type ContactQuoteFormProps = {
  config?: QuoteFormConfig;
};

export function ContactQuoteForm({ config = defaultQuoteFormConfig }: ContactQuoteFormProps) {
  const [values, setValues] = useState<QuotePayload>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isDisabled =
    isSubmitting ||
    !values.fullName.trim() ||
    !values.phone.trim() ||
    !values.email.trim() ||
    !values.eventType.trim() ||
    !values.budget.trim();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
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
        throw new Error(data.message ?? "Nie udalo sie wyslac zapytania.");
      }

      setValues(initialValues);
      setSuccessMessage(config.successMessage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Wystapil nieoczekiwany blad."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <input
          type="text"
          className="h-[58px] w-full rounded-xl border border-[#e5dbd7] bg-white px-5 font-sans text-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder={config.fullNamePlaceholder}
          value={values.fullName}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, fullName: event.target.value }))
          }
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <input
          type="tel"
          maxLength={20}
          className="h-[58px] w-full rounded-xl border border-[#e5dbd7] bg-white px-5 font-sans text-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder={config.phonePlaceholder}
          value={values.phone}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, phone: event.target.value }))
          }
          required
        />
        <input
          type="email"
          className="h-[58px] w-full rounded-xl border border-[#e5dbd7] bg-white px-5 font-sans text-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder={config.emailPlaceholder}
          value={values.email}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <select
          className="h-[58px] w-full rounded-xl border border-[#e5dbd7] bg-white px-5 font-sans text-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={values.eventType}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, eventType: event.target.value }))
          }
          required
        >
          <option value="" disabled>
            {config.eventPlaceholder}
          </option>
          {config.eventOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="h-[58px] w-full rounded-xl border border-[#e5dbd7] bg-white px-5 font-sans text-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={values.eventDate}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, eventDate: event.target.value }))
          }
        />
      </div>

      <div>
        <select
          className="h-[58px] w-full rounded-xl border border-[#e5dbd7] bg-white px-5 font-sans text-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={values.budget}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, budget: event.target.value }))
          }
          required
        >
          <option value="" disabled>
            {config.budgetPlaceholder}
          </option>
          {config.budgetOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <textarea
          rows={3}
          className="w-full resize-none rounded-xl border border-[#e5dbd7] bg-white p-5 font-sans text-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder={config.messagePlaceholder}
          value={values.message}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, message: event.target.value }))
          }
        />
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className="flex h-[58px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[#e59fbe] font-sans font-bold text-white transition-all hover:from-primary-hover hover:to-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Wysylanie..." : config.submitLabel}
      </button>

      {successMessage ? (
        <p className="text-sm font-medium text-green-700">{successMessage}</p>
      ) : null}
      {errorMessage ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}
    </form>
  );
}
