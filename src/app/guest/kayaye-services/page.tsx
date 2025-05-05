"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Package,
  ShoppingCart,
  Briefcase,
  Home,
  Calendar,
  MapPin,
  PenTool,
  ChevronRight,
  Check,
  Info,
} from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CategoryScroller } from "./CategoryScroller";

interface Service {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  icon: React.JSX.Element;
  pricing: string;
  locations: string[];
  popular: boolean;
  background: string;
}

export default function ServicesPage() {
  // Close expanded categories menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const expandedMenuRef =
        document.querySelector<HTMLDivElement>(".expanded-menu");
      if (expandedMenuRef && !expandedMenuRef.contains(event.target as Node)) {
        console.log("Clicked outside expanded menu");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const serviceCategories = [
    { id: "all", label: "All Services" },
    { id: "shopping", label: "Shopping" },
    { id: "delivery", label: "Delivery" },
    { id: "carrying", label: "Carrying" },
    { id: "errands", label: "Errands" },
    // Example of future categories that would trigger horizontal scrolling
    // Uncomment to test scrolling behavior

    // { id: "specialty", label: "Specialty" },
    // { id: "business", label: "Business" },
    // { id: "education", label: "Education" },
    // { id: "events", label: "Events" },
    // { id: "health", label: "Health" },
    // { id: "transportation", label: "Transportation" },
    // { id: "cleaning", label: "Cleaning" },
    // { id: "maintenance", label: "Maintenance" },
    // { id: "pet-care", label: "Pet Care" },
    // { id: "home-services", label: "Home Services" },
  ];

  const services = [
    {
      id: 1,
      title: "Grocery Shopping",
      description:
        "Have your groceries picked up from supermarkets or local shops and delivered to your doorstep.",
      longDescription:
        "Our trusted carriers will pick up your grocery items from any supermarket, local shop, or vendor of your choice and deliver them directly to your home. Simply provide your shopping list and any specific requirements, and we'll handle the rest. Perfect for busy professionals, parents, or anyone who wants to save time and avoid crowded shopping experiences.",
      category: "shopping",
      icon: <ShoppingBag className="w-6 h-6 text-green-600" />,
      pricing: "From GH₵20 + 10% of purchase",
      locations: ["Accra", "Kumasi", "Tamale", "Takoradi"],
      popular: true,
      background: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: 2,
      title: "Market Shopping",
      description:
        "Send experienced locals to shop at traditional markets for authentic Ghanaian goods.",
      longDescription:
        "Leverage the knowledge of our local carriers who understand Ghanaian markets and can negotiate the best prices on your behalf. Our carriers are familiar with the bustling markets of Ghana and can help you source specific ingredients, fabrics, crafts, or other traditional goods. This service is especially popular with expatriates, visitors, and those looking for authentic local products without navigating crowded market spaces.",
      category: "shopping",
      icon: <ShoppingCart className="w-6 h-6 text-yellow-600" />,
      pricing: "From GH₵25 + 12% of purchase",
      locations: ["Accra", "Kumasi", "Tamale", "Takoradi", "Cape Coast"],
      popular: true,
      background: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      id: 3,
      title: "Package Delivery",
      description:
        "Send documents or packages across town quickly and securely with real-time tracking.",
      longDescription:
        "Our reliable package delivery service ensures your important documents, parcels, and items reach their destination safely and on time. Each delivery comes with real-time tracking and confirmation upon delivery. Our carriers are trained to handle items with care and maintain confidentiality. Ideal for businesses sending documents, individuals sending gifts, or anyone needing same-day delivery services within city limits.",
      category: "delivery",
      icon: <Package className="w-6 h-6 text-blue-600" />,
      pricing: "From GH₵15 based on distance and size",
      locations: [
        "Accra",
        "Kumasi",
        "Tamale",
        "Takoradi",
        "Cape Coast",
        "Tema",
      ],
      popular: true,
      background: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: 4,
      title: "Luggage Carrying",
      description:
        "Get assistance with heavy bags at markets, bus stations, or transportation hubs.",
      longDescription:
        "Our traditional kayaye service offers help with carrying heavy items and luggage at markets, bus stations, airports, and other transportation hubs. This service honors the long-standing kayaye tradition in Ghana while providing fair compensation and safe working conditions for our carriers. Perfect for travelers, shoppers with heavy purchases, or anyone needing assistance with bulky items in public spaces.",
      category: "carrying",
      icon: <Briefcase className="w-6 h-6 text-purple-600" />,
      pricing: "From GH₵15 per hour",
      locations: ["Accra", "Kumasi", "Tamale", "Takoradi"],
      popular: true,
      background: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      id: 5,
      title: "Home Moving Assistance",
      description:
        "Get help moving small furniture and belongings between locations.",
      longDescription:
        "Our carriers can help with small to medium-sized moving tasks, including packing and unpacking, carrying items between locations, and setting up basic furniture. While not a full-service moving company, our carriers provide flexible, affordable assistance for smaller moves within the same neighborhood or city. Ideal for students moving dormitories, renters changing apartments, or anyone needing extra hands for a partial move.",
      category: "carrying",
      icon: <Home className="w-6 h-6 text-orange-600" />,
      pricing: "From GH₵50 per carrier (minimum 2 hours)",
      locations: ["Accra", "Kumasi"],
      popular: false,
      background: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      id: 6,
      title: "Bill Payment",
      description:
        "Have someone pay your utility bills, school fees, or other payments in person.",
      longDescription:
        "Save time and avoid long queues by having our trusted carriers make payments on your behalf. Our carriers can pay utility bills, school fees, government fees, and other obligations at physical payment locations. Simply provide the payment details and funds, and we'll handle the transaction and return with an official receipt. Perfect for busy professionals and those who prefer not to deal with payment centers.",
      category: "errands",
      icon: <PenTool className="w-6 h-6 text-indigo-600" />,
      pricing: "From GH₵15 per errand",
      locations: [
        "Accra",
        "Kumasi",
        "Tamale",
        "Takoradi",
        "Cape Coast",
        "Tema",
      ],
      popular: false,
      background: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      id: 7,
      title: "Queue Standing",
      description:
        "Hire someone to stand in line for you at busy government offices, banks, or service centers.",
      longDescription:
        "Avoid wasting hours in long lines by having our carriers hold your place in queues at government offices, banks, service centers, and other establishments known for long wait times. Once your carrier approaches the front of the line, they'll notify you so you can arrive just in time for your turn. This service helps you maximize your productive time while ensuring you don't miss your place in line.",
      category: "errands",
      icon: <Calendar className="w-6 h-6 text-pink-600" />,
      pricing: "From GH₵20 per hour",
      locations: ["Accra", "Kumasi"],
      popular: false,
      background: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      id: 8,
      title: "Custom Errands",
      description:
        "Need something specific? Request a custom errand and we'll match you with the right carrier.",
      longDescription:
        "Have a unique errand that doesn't fit into our standard categories? Our custom errand service allows you to describe your specific needs, and we'll match you with carriers who have the right skills and experience. From picking up prescription medication to dropping off items for repair, or other miscellaneous tasks around town, our carriers can help with a wide variety of custom requests.",
      category: "errands",
      icon: <MapPin className="w-6 h-6 text-teal-600" />,
      pricing: "Custom quote based on task complexity",
      locations: [
        "Accra",
        "Kumasi",
        "Tamale",
        "Takoradi",
        "Cape Coast",
        "Tema",
      ],
      popular: false,
      background: "bg-teal-100 dark:bg-teal-900/30",
    },
  ];

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedService, setSelectedService] = useState(services[0]);

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((service) => service.category === activeCategory);

  const handleServiceSelect = (service: Service): void => {
    setSelectedService(service);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Our Services
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Kayaye offers a wide range of reliable services to make your daily
          life easier. From shopping and deliveries to traditional carrying
          services, we&#39;ve got you covered.
        </p>
      </motion.div>

      {/* Main Content with Tabs and Detail View */}
      <div className="mb-16">
        <div className="relative">
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveCategory}
          >
            {/* Horizontal scrolling categories with expandable view */}
            <CategoryScroller
              categories={serviceCategories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />

            {serviceCategories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-0"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Services List */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="md:w-1/3 lg:w-1/4"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-medium p-4 border-b dark:border-gray-700 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Available Services
                      </h3>
                      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredServices.map((service) => (
                          <li key={service.id}>
                            <button
                              onClick={() => handleServiceSelect(service)}
                              className={`w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all ${
                                selectedService.id === service.id
                                  ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`p-2 mr-3 rounded-lg ${service.background}`}
                                >
                                  {service.icon}
                                </div>
                                <div className="text-left">
                                  <h4 className="font-medium">
                                    {service.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                    {service.pricing}
                                  </p>
                                </div>
                              </div>
                              {selectedService.id === service.id ? (
                                <Check className="w-5 h-5 text-blue-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Service Detail View */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedService.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                      className="md:w-2/3 lg:w-3/4"
                    >
                      <Card className="h-full border-none shadow-xl overflow-hidden">
                        <CardHeader
                          className={cn("pb-8", selectedService.background)}
                        >
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div className="flex items-center">
                              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl mr-4 shadow-md">
                                {React.cloneElement(
                                  selectedService.icon as React.ReactElement
                                )}
                              </div>
                              <div>
                                <CardTitle className="text-2xl md:text-3xl font-bold">
                                  {selectedService.title}
                                </CardTitle>
                                <CardDescription className="text-gray-700 dark:text-gray-200 mt-1 text-lg">
                                  {selectedService.description}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {selectedService.popular && (
                                <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                                  Popular Service
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-8">
                          <div className="space-y-8">
                            <div>
                              <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                                <span className="inline-block w-1.5 h-6 bg-blue-600 rounded-full mr-1"></span>
                                About this Service
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {selectedService.longDescription}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <span className="text-blue-600 text-sm">
                                      ₵
                                    </span>
                                  </span>
                                  Pricing
                                </h3>
                                <div>
                                  <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                                    {selectedService.pricing}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Prices may vary based on specific
                                    requirements
                                  </p>
                                </div>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <MapPin className="w-3 h-3 text-blue-600" />
                                  </span>
                                  Available Locations
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {selectedService.locations.map(
                                    (location, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="px-3 py-1 rounded-full border-blue-200 dark:border-blue-800"
                                      >
                                        {location}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Booking Information */}
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
                              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-blue-600" />
                                </span>
                                How to Book
                              </h3>
                              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                                {[
                                  'Select this service and click the "Book Now" button below',
                                  "Fill in the required details for your specific request",
                                  "Choose your preferred date and time",
                                  "Get matched with a verified carrier in your area",
                                ].map((step, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center gap-3"
                                  >
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                                      {idx + 1}
                                    </span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-6">
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                          >
                            Contact Support
                          </Button>
                          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                            Book This Service
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* How It Works Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-10 shadow-lg"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            How Kayaye Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                title: "Book a Service",
                description:
                  "Choose the service you need and provide the necessary details",
                step: 1,
              },
              {
                title: "Get Matched",
                description:
                  "We'll connect you with a verified, trusted carrier in your area",
                step: 2,
              },
              {
                title: "Task Completed",
                description:
                  "Your carrier completes the task and you pay securely through the app",
                step: 3,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center text-center group hover:shadow-xl transition-all"
              >
                <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-white text-xl font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg"
            >
              Learn More About How It Works
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
