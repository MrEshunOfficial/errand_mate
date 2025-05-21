import React from "react";

interface PageProps {
  params: {
    param: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="p-4 text-xl font-semibold">
      Dynamic page for param:{" "}
      <span className="text-blue-600">{params.param}</span>
    </div>
  );
}
