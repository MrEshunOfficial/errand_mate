import CategoryLayout from "@/components/ui/CategoryServiceBaseLayout";

// app/categories/layout.tsx
export default function PublicCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CategoryLayout
      isAdmin={false}
      userRole="user"
      basePath="/errand-services/categories">
      {children}
    </CategoryLayout>
  );
}
