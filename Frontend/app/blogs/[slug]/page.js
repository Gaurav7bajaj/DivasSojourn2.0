import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogs } from "../../data/blogs";

const pageBaseUrl = "https://divassojourn.com/blogs";

export function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    return {
      title: "Blog Not Found | Divas Sojourn",
    };
  }

  return {
    title: `${blog.title} | Divas Sojourn Blog`,
    description: blog.excerpt,
    alternates: {
      canonical: `/blogs/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `${pageBaseUrl}/${blog.slug}`,
      images: [
        {
          url: blog.image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    image: blog.image,
    datePublished: blog.datePublished,
    author: {
      "@type": "Organization",
      name: blog.author || "Divas Sojourn",
    },
    description: blog.excerpt,
    url: `${pageBaseUrl}/${blog.slug}`,
  };

  return (
    <main className="bg-[#1A1A1A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <article>
        <section className="relative flex min-h-[460px] items-end overflow-hidden px-4 py-14">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />
          <div className="relative z-10 mx-auto max-w-5xl">
            <span className="rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#0F0F0F]">
              {blog.category}
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">{blog.title}</h1>
            <p className="mt-4 text-sm font-semibold text-white/75">
              By {blog.author} | {blog.date} | {blog.readingTime} read
            </p>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[#D4AF37]/25 bg-[#0F0F0F] p-6 shadow-2xl md:p-10">
            <p className="text-lg leading-9 text-white/85">{blog.excerpt}</p>
            <p className="mt-6 leading-8 text-white/75">
              Full article content will be added soon. This placeholder route is ready for the blog
              detail page and keeps all blog links working across the website.
            </p>
            <Link
              href="/blogs"
              className="mt-8 inline-flex rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-black uppercase tracking-wide text-[#0F0F0F] transition hover:bg-[#E8C547]"
            >
              Back to Blogs
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
