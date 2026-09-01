import { BlogPageHeader, BlogsListingClient, FeaturedBlog } from "../components/blogs";
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
  const featuredImage = blogs.find((blog) => blog.featured)?.image || blogs[0]?.image;

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
    ...blogs.map((blog) => ({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      image: blog.image,
      datePublished: blog.datePublished,
      author: {
        "@type": "Person",
        name: blog.author,
      },
      description: blog.excerpt,
      url: `${pageUrl}/${blog.slug}`,
    })),
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {featuredImage ? (
        <meta property="og:image" content={featuredImage} />
      ) : null}
      <BlogPageHeader />
      <FeaturedBlog blogs={blogs} />
      <BlogsListingClient blogs={blogs} />
      <ShortContactForm pageLabel="Blogs" storageKey="divasBlogLeads" />
    </main>
  );
}
