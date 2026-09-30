import { Suspense } from "react";
import { BlogsListingClient } from "../components/blogs";
import ShortContactForm from "../components/international/ShortContactForm";
import { getPublishedBlogs } from "../lib/data/blogs";
import { toPublicBlogCard } from "../lib/data/mappers";

export const dynamic = "force-dynamic";

const pageUrl = "https://divassojourn.com/blogs";

export const metadata = {
  title: "Travel Blog | Tips, Guides & Stories",
  description:
    "Read our latest travel blogs featuring destination guides, travel tips, and real stories from our community of female travelers.",
  keywords: [
    "travel blog",
    "travel guides",
    "destination guides",
    "travel tips",
    "travel stories",
    "women travelers",
    "travel journal",
  ],
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "Travel Blog | Tips, Guides & Stories | Divas Sojourn",
    description:
      "Explore travel destinations, tips, and stories from experienced women travelers.",
    url: pageUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Blog | Tips, Guides & Stories | Divas Sojourn",
    description: "Destination guides, travel tips, and stories from the Divas Sojourn community.",
  },
};

export default async function BlogsPage() {
  const blogs = (await getPublishedBlogs()).map(toPublicBlogCard);
  const featuredImage =
    blogs.find((blog) => blog.featured && blog.image)?.image ||
    blogs.find((blog) => blog.image)?.image;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Divas Journal",
    description:
      "Destination guides, packing lists and real stories from our community of women travellers.",
    numberOfItems: blogs.length,
    itemListElement: blogs.map((blog, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${pageUrl}/${blog.slug}`,
      item: {
        "@type": "BlogPosting",
        headline: blog.title,
        image: blog.image || undefined,
        datePublished: blog.datePublished,
        author: {
          "@type": "Person",
          name: blog.author,
        },
        description: blog.excerpt,
        url: `${pageUrl}/${blog.slug}`,
      },
    })),
  };

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://divassojourn.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blogs",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "The Divas Journal",
      url: pageUrl,
      publisher: {
        "@type": "Organization",
        name: "Divas Sojourn",
        url: "https://divassojourn.com",
      },
    },
    itemList,
  ];

  return (
    <main className="bg-[#0B0B0C]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {featuredImage ? <meta property="og:image" content={featuredImage} /> : null}
      <Suspense
        fallback={
          <div className="px-6 py-24 text-center font-[family-name:var(--font-dm-sans)] text-[#D9D3C6]">
            Loading journal…
          </div>
        }
      >
        <BlogsListingClient blogs={blogs} />
      </Suspense>
      <ShortContactForm pageLabel="Blogs" storageKey="divasBlogLeads" />
    </main>
  );
}
