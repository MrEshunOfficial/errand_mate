// app/guest/kayaye-services/[category]/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-gray-700">
      <h1 className="text-3xl font-bold mb-2">Category Not Found</h1>
      <p className="mb-4 text-gray-500">
        The category you’re looking for doesn’t exist or has been removed.
      </p>
      <Link
        href="/guest/kayaye-services"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Services
      </Link>
    </div>
  );
}
