import { blogs } from "../../data/blogs";
import BlogCard from "./BlogCard";

export default function BlogsSection({
  posts = blogs,
  title = "Latest Travel Stories",
  subtitle = "Tips, Stories & Inspiration From Our Trips",
}) {
  return (
    <section className="bg-[#1A1A1A] px-4 py-16" aria-labelledby="blogs-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="blogs-heading" className="text-3xl font-black text-white md:text-5xl">
            {title}
          </h2>
          <p className="mt-3 text-lg font-semibold text-white">{subtitle}</p>
          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-[#D4AF37]" aria-hidden="true" />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}
