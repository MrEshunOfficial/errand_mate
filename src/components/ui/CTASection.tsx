import React from "react";

export default function CTASection() {
  return (
    <section className="py-12 md:py-16">
      <div className="bg-blue-600 dark:bg-blue-700 rounded-xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to get started?
        </h2>
        <p className="mb-8 max-w-2xl mx-auto">
          Join thousands of happy customers who trust Kayaye for their errand
          needs
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-md transition-colors font-medium"
          >
            Find a Runner
          </a>
          <a
            href="#"
            className="px-8 py-3 bg-transparent border border-white hover:bg-blue-700 rounded-md transition-colors font-medium"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
