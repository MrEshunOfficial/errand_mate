import React from "react";

interface PageProps {
  params: Promise<{ [key: string]: string | string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  // Await the params and searchParams in Next.js 15
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <div>
      <h1>Dynamic Page</h1>
      <p>Params: {JSON.stringify(resolvedParams)}</p>
      <p>Search Params: {JSON.stringify(resolvedSearchParams)}</p>
    </div>
  );
}
