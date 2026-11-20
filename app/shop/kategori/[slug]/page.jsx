import { Suspense } from "react";
import { notFound } from "next/navigation";
import CategoryProducts from "../../CategoryProducts";
import { categoryNames, categorySlug } from "../../categories";

export function generateStaticParams() {
  return categoryNames.map((name) => ({ slug: categorySlug(name) }));
}

async function CategoryContent({ params }) {
  const { slug } = await params;
  const name = categoryNames.find((category) => categorySlug(category) === slug);

  if (!name) notFound();

  return <CategoryProducts category={name} />;
}

export default function CategoryPage({ params }) {
  return (
    <Suspense fallback={<div className="page">Indlæser kategori...</div>}>
      <CategoryContent params={params} />
    </Suspense>
  );
}
