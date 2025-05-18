"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

// Streamlined FAQs with combined topics
export const faqs: FAQItem[] = [
  {
    question: "How much does Errands mate cost and how do I pay?",
    answer:
      "Errands mate charges a service fee (typically 10-15%) on top of the task cost, which varies based on service type, distance, and complexity. You'll see the total estimated cost before confirming any request. Payments are made securely through the app using credit/debit cards or mobile money. You can also add tips for excellent service.",
  },
  {
    question:
      "How are Service Providers verified and what if something goes wrong?",
    answer:
      "All Service Providers undergo a comprehensive verification process including ID verification, background checks, and interviews for certain service types. We maintain a rating system to ensure quality. If issues arise during a task, you can communicate through our in-app chat or contact support directly.",
  },
  {
    question: "Where and when is Errands mate available?",
    answer:
      "Errands mate is currently available in Accra, Kumasi, Tamale, and Takoradi, with rapid expansion to other locations throughout Ghana. You can request services immediately or schedule them up to two weeks in advance by specifying your preferred date and time when creating your request.",
  },
  {
    question: "Can I cancel a service request?",
    answer:
      "Yes, you can cancel a service request up to 30 minutes before the scheduled time without any charges. Cancellations made after this period may incur a small fee.",
  },
  {
    question: "How do I become an Errands mate Service Provider?",
    answer:
      "Download the Errands mate Service Provider app or visit our website, complete the application form, and follow the verification process. Once approved, you'll undergo training and can start accepting tasks.",
  },
];

interface FAQSectionProps {
  title?: string;
  description?: string;
  className?: string;
  faqsToShow?: FAQItem[];
}

export default function FAQSection({
  title = "Frequently Asked Questions",
  description = "Get answers to common questions about using Errands mate",
  className = "",
  faqsToShow = faqs,
}: FAQSectionProps) {
  return (
    <section className={cn("mb-16", className)}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        {description && (
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqsToShow.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
