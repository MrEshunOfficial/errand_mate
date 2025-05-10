import React from "react";

interface TestimonialItem {
  quote: string;
  name: string;
  location: string;
}

const testimonials: TestimonialItem[] = [
  {
    quote:
      "Errands mate has been a lifesaver for me! I no longer have to worry about carrying my heavy shopping bags from the market.",
    name: "Amina K.",
    location: "Accra, Ghana",
  },
  {
    quote:
      "As a busy professional, having someone run errands for me has saved me countless hours. The service is reliable and affordable.",
    name: "Emmanuel O.",
    location: "Lagos, Nigeria",
  },
  {
    quote:
      "I use Errands mate weekly for my grocery shopping. The runners are always on time and careful with my items.",
    name: "Fatima M.",
    location: "Nairobi, Kenya",
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800 rounded-xl my-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Trusted by thousands of people across Africa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-500 dark:text-blue-300">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="font-bold">{testimonial.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.location}
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 italic">
              {testimonial.quote}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
