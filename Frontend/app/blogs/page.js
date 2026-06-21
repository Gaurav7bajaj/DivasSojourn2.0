import { BlogPageHeader, BlogsListingClient, FeaturedBlog } from "../components/blogs";
import { blogs } from "../data/blogs";

const pageUrl = "https://divassojourn.com/blogs";
const featuredImage = blogs.find((blog) => blog.featured)?.image || blogs[0]?.image;

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
    images: featuredImage
      ? [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: "Divas Sojourn travel blog stories",
          },
        ]
      : [],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Blog | Tips, Guides & Stories | Divas Sojourn",
    description: "Destination guides, travel tips, and stories from the Divas Sojourn community.",
    images: featuredImage ? [featuredImage] : [],
  },
};

export default function BlogsPage() {
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
      <BlogPageHeader />
      <FeaturedBlog blogs={blogs} />
      <BlogsListingClient blogs={blogs} />
    </main>
  );
}
