// app/main/[id]/page.tsx
import { type FC } from "react";

interface PageProps {
  params: { id: string };
}

const CategoryMainPage: FC<PageProps> = ({ params }) => {
  const { id } = params;

  return (
    <main className="container mx-auto max-w-7xl p-4">
      <h1 className="text-2xl font-bold mb-4">
        Category and Service Management
      </h1>
      <p className="text-gray-700">
        Currently viewing ID: <span className="font-medium">{id}</span>
      </p>
    </main>
  );
};

export default CategoryMainPage;
