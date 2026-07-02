import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/products/ProductDetail";
import { products, getProduct } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} dla partnerów | ICAROS Polska`,
    description: product.shortDesc,
    alternates: { canonical: `/urzadzenia/${slug}` },
  };
}

export default async function UrzadzeniePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return (
    <ProductDetail product={product} theme="dark" variant="business" basePath="/urzadzenia" />
  );
}
