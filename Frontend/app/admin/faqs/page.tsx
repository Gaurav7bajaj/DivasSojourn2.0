import FaqsAdminClient from "./FaqsAdminClient";

export const dynamic = "force-dynamic";

export default function AdminFaqsPage() {
  return (
    <div>
      <h1 className="text-3xl font-black">FAQs</h1>
      <p className="mt-2 text-sm text-[#555555]">
        Create, edit, reorder, and delete questions shown on the public FAQs page.
      </p>
      <div className="mt-8">
        <FaqsAdminClient />
      </div>
    </div>
  );
}
