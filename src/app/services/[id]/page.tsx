import React from "react";

interface PageProps {
  params: Promise<{ [key: string]: string | string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  // Await the params and searchParams since they're now promises in Next.js 15
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <div>
      <h1>Dynamic Page</h1>
      <div>
        <h2>Params:</h2>
        <pre>{JSON.stringify(resolvedParams, null, 2)}</pre>
      </div>
      <div>
        <h2>Search Params:</h2>
        <pre>{JSON.stringify(resolvedSearchParams, null, 2)}</pre>
      </div>
    </div>
  );
}
