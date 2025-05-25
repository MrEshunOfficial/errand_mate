// src/app/admin/[id]/services/new/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import { AddServiceForm } from "./AddServiceForm";

interface PageProps {
  params: {
    id: string;
  };
}

const AddServicePage: React.FC<PageProps> = async ({ params }) => {
  const categoryId = params.id;

  if (!categoryId) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <AddServiceForm categoryId={categoryId} />
    </div>
  );
};

export default AddServicePage;
