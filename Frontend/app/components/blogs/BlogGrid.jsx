import BlogListingCard from "./BlogListingCard";

export default function BlogGrid({ blogs, visibleCount, onLoadMore }) {
  const visibleBlogs = blogs.slice(0, visibleCount);
  const canLoadMore = visibleCount < blogs.length;

  return (
    <section className="mt-10" aria-labelledby="all-blogs-heading">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="all-blogs-heading" className="text-2xl font-black text-white">
            Explore All Blogs
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#E0E0E0]">Showing {blogs.length} travel stories</p>
        </div>
      </div>

      {visibleBlogs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleBlogs.map((blog) => (
            <BlogListingCard key={blog.slug} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-[#D4AF37]/30 bg-[#1F1F1F] p-10 text-center">
          <p className="text-xl font-black text-white">No blogs found.</p>
          <p className="mt-2 text-[#E0E0E0]">Try adjusting your filters or search term.</p>
        </div>
      )}

      {canLoadMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="rounded-full bg-[#D4AF37] px-8 py-3 font-black uppercase tracking-wide text-[#1A1A1A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E8C547] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)]"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}
