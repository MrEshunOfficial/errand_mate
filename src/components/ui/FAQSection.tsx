import React from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I know my provider is trustworthy?",
    answer:
      "All service providers runners go through a rigorous background check and verification process. We also have a rating system so you can see feedback from previous customers.",
  },
  {
    question: "How much does the service cost?",
    answer:
      "Pricing varies depending on the service, distance, and size of items. You'll see the exact price before confirming your booking.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We currently operate in major cities across Ghana, Nigeria, Kenya, and South Africa, with plans to expand to more locations soon.",
  },
  {
    question: "How quickly can I get a service provider?",
    answer:
      "In most areas, you can find available service provider within 15-30 minutes, depending on demand and time of day.",
  },
  {
    question: "Can I schedule services in advance?",
    answer:
      "Yes, you can schedule errands up to two weeks in advance through our app or website.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        Frequently Asked Questions
      </h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
            <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
