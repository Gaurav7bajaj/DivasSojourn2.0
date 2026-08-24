import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-black">Dashboard</h1>
      <p className="mt-2 text-sm text-[#555555]">Manage blogs, gallery photos, and trips.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/blogs"
          className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:border-[#0F9B9B]"
        >
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0F9B9B]">Content</p>
          <h2 className="mt-2 text-xl font-black">Manage Blogs</h2>
          <p className="mt-2 text-sm text-[#555555]">Create, edit, publish, and delete blog posts.</p>
        </Link>

        <Link
          href="/admin/gallery"
          className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:border-[#0F9B9B]"
        >
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0F9B9B]">Media</p>
          <h2 className="mt-2 text-xl font-black">Manage Gallery</h2>
          <p className="mt-2 text-sm text-[#555555]">Upload and remove gallery photos.</p>
        </Link>

        <Link
          href="/admin/trips"
          className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:border-[#0F9B9B]"
        >
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0F9B9B]">Trips</p>
          <h2 className="mt-2 text-xl font-black">Manage Trips</h2>
          <p className="mt-2 text-sm text-[#555555]">
            Add and edit India & International trips for listings, details, and calendar.
          </p>
        </Link>
      </div>
    </div>
  );
}
