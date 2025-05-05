import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ServiceItem {
  title: string;
  description: string;
  image: string;
  href: string;
}

const services: ServiceItem[] = [
  {
    title: "Grocery Shopping",
    description: "Get your groceries delivered to your doorstep",
    image: "bg-blue-100 dark:bg-blue-900",
    href: "/services?category=shopping",
  },
  {
    title: "Luggage Carrying",
    description: "Help with your heavy bags at markets or stations",
    image: "bg-green-100 dark:bg-green-900",
    href: "/services?category=carrying",
  },
  {
    title: "Package Delivery",
    description: "Send or receive packages across town",
    image: "bg-yellow-100 dark:bg-yellow-900",
    href: "/services?category=delivery",
  },
  {
    title: "Market Shopping",
    description: "Have someone shop for you at local markets",
    image: "bg-purple-100 dark:bg-purple-900",
    href: "/services?category=shopping",
  },
];

export default function PopularServices() {
  return (
    <section className="py-12 md:py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Popular Services</h2>
        <Link
          href="/guest/kayaye-services"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
        >
          View all services
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <Link
            key={index}
            href={service.href}
            className="group relative rounded-lg overflow-hidden shadow-md h-64 transition-transform hover:translate-y-1 hover:shadow-lg"
          >
            <div
              className={`absolute inset-0 ${service.image} transition-transform group-hover:scale-105 duration-500`}
            ></div>
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-opacity"></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-white mb-2">
                {service.title}
              </h3>
              <p className="text-white text-opacity-90 text-sm">
                {service.description}
              </p>
              <div className="mt-4 text-sm text-white font-medium inline-flex items-center group-hover:underline">
                Book now
                <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
