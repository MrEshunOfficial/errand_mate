// // Example 1: Basic usage with default error page redirect
// import { connect, connectWithRedirect } from './path/to/mongodb-connection';

// // In a client-side component or page
// export default function MyPage() {
//   useEffect(() => {
//     connect(); // Will redirect to '/connection-failed' on error
//   }, []);

//   return <div>My Page Content</div>;
// }

// // Example 2: API Route with server-side redirect
// // pages/api/users.ts or app/api/users/route.ts
// import { connectWithRedirect } from './path/to/mongodb-connection';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest, res?: NextResponse) {
//   try {
//     await connectWithRedirect(res); // Will redirect to error page if connection fails

//     // Your API logic here
//     return NextResponse.json({ message: 'Success' });
//   } catch (error) {
//     return NextResponse.json({ error: 'Connection failed' }, { status: 500 });
//   }
// }

// // Example 3: Custom configuration
// import { connect, ConnectionConfig } from './path/to/mongodb-connection';

// const customConfig: ConnectionConfig = {
//   redirectOnError: true,
//   errorPageUrl: '/database-error',
//   onConnectionError: (error) => {
//     // Custom error logging or notification
//     console.log('Custom error handler:', error);
//     // You could send to error tracking service here
//   }
// };

// await connect(customConfig);

// Example 4: Next.js middleware for protecting routes
// middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(request: NextRequest) {
//   try {
//     await connect({
//       redirectOnError: true,
//       errorPageUrl: "/maintenance",
//     });

//     return NextResponse.next();
//   } catch (error) {
//     return NextResponse.redirect(new URL("/maintenance", request.url));
//   }
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/api/:path*"],
// };

// Example 5: Error page component
// pages/connection-failed.tsx or app/connection-failed/page.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ConnectionFailed() {
  const router = useRouter();
  const [errorDetails, setErrorDetails] = useState<{
    message?: string;
    code?: string;
  }>({});

  useEffect(() => {
    if (router.query) {
      setErrorDetails({
        message: router.query.message as string,
        code: router.query.code as string,
      });
    }
  }, [router.query]);

  const handleRetry = () => {
    router.back(); // Go back and retry
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <div className="mt-4 text-center">
          <h1 className="text-lg font-medium text-gray-900">
            Database Connection Failed
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;re having trouble connecting to our database. Please try
            again in a few moments.
          </p>

          {errorDetails.message && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <p className="text-xs text-gray-700">
                <strong>Error:</strong> {errorDetails.message}
              </p>
              {errorDetails.code && (
                <p className="text-xs text-gray-700 mt-1">
                  <strong>Code:</strong> {errorDetails.code}
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleRetry}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
