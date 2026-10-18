import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";
import { faqItems } from "../../data/faqs";

export type FaqDto = {
  id: string;
  slug: string;
  sortOrder: number;
  category: string;
  question: string;
  answer: string;
  published: boolean;
};

type FaqDelegate = NonNullable<(typeof prisma)["faq"]>;

function slugify(value: string): string {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `faq-${Date.now()}`;
}

function staticFaqsAsDto(): FaqDto[] {
  return faqItems.map((item, index) => ({
    id: item.id,
    slug: item.id,
    sortOrder: index + 1,
    category: item.category,
    question: item.question,
    answer: item.answer,
    published: true,
  }));
}

/**
 * Resolve the Faq delegate, recovering from a stale Prisma client that was
 * created before `prisma generate` included the Faq model (common with Next HMR).
 */
function faqModel(): FaqDelegate | null {
  const existing = (prisma as { faq?: FaqDelegate }).faq;
  if (existing) return existing;

  const fresh = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  const model = (fresh as { faq?: FaqDelegate }).faq ?? null;
  if (model && process.env.NODE_ENV !== "production") {
    const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
    void globalForPrisma.prisma?.$disconnect().catch(() => undefined);
    globalForPrisma.prisma = fresh;
    return model;
  }

  void fresh.$disconnect().catch(() => undefined);
  return null;
}

/** Seed DB from static FAQs when empty (first load / after migrate). */
export async function ensureFaqsSeeded() {
  const faq = faqModel();
  if (!faq) return;

  const count = await faq.count();
  if (count > 0) return;

  await faq.createMany({
    data: faqItems.map((item, index) => ({
      slug: item.id,
      sortOrder: index + 1,
      category: item.category,
      question: item.question,
      answer: item.answer,
      published: true,
    })),
  });
}

export async function getPublishedFaqs(): Promise<FaqDto[]> {
  try {
    const faq = faqModel();
    if (!faq) return staticFaqsAsDto();

    await ensureFaqsSeeded();
    const rows = await faq.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
    if (!rows.length) return staticFaqsAsDto();
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      sortOrder: row.sortOrder,
      category: row.category,
      question: row.question,
      answer: row.answer,
      published: row.published,
    }));
  } catch (error) {
    console.error("getPublishedFaqs failed, using static fallback", error);
    return staticFaqsAsDto();
  }
}

export async function getAllFaqs(): Promise<FaqDto[]> {
  const faq = faqModel();
  if (!faq) return staticFaqsAsDto();

  await ensureFaqsSeeded();
  const rows = await faq.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    sortOrder: row.sortOrder,
    category: row.category,
    question: row.question,
    answer: row.answer,
    published: row.published,
  }));
}

export async function createFaq(input: {
  category: string;
  question: string;
  answer: string;
  slug?: string;
  sortOrder?: number;
  published?: boolean;
}): Promise<FaqDto> {
  const category = input.category.trim();
  const question = input.question.trim();
  const answer = input.answer.trim();
  if (!category || !question || !answer) {
    throw new Error("Category, question, and answer are required.");
  }

  const faq = faqModel();
  if (!faq) {
    throw new Error(
      "FAQ database model is unavailable. Restart the Next.js server after running prisma generate.",
    );
  }

  let slug = (input.slug || "").trim() || slugify(question);
  const existing = await faq.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const maxOrder = await faq.aggregate({ _max: { sortOrder: true } });
  const sortOrder =
    typeof input.sortOrder === "number" && Number.isFinite(input.sortOrder)
      ? input.sortOrder
      : (maxOrder._max.sortOrder ?? 0) + 1;

  const row = await faq.create({
    data: {
      slug,
      sortOrder,
      category,
      question,
      answer,
      published: input.published !== false,
    },
  });

  return {
    id: row.id,
    slug: row.slug,
    sortOrder: row.sortOrder,
    category: row.category,
    question: row.question,
    answer: row.answer,
    published: row.published,
  };
}

export async function updateFaq(
  id: string,
  input: {
    category?: string;
    question?: string;
    answer?: string;
    slug?: string;
    sortOrder?: number;
    published?: boolean;
  },
): Promise<FaqDto> {
  const data: {
    category?: string;
    question?: string;
    answer?: string;
    slug?: string;
    sortOrder?: number;
    published?: boolean;
  } = {};

  if (input.category != null) data.category = String(input.category).trim();
  if (input.question != null) data.question = String(input.question).trim();
  if (input.answer != null) data.answer = String(input.answer).trim();
  if (input.slug != null) {
    const slug = String(input.slug).trim() || slugify(data.question || "faq");
    data.slug = slug;
  }
  if (input.sortOrder != null && Number.isFinite(Number(input.sortOrder))) {
    data.sortOrder = Number(input.sortOrder);
  }
  if (typeof input.published === "boolean") data.published = input.published;

  const faq = faqModel();
  if (!faq) {
    throw new Error(
      "FAQ database model is unavailable. Restart the Next.js server after running prisma generate.",
    );
  }

  const row = await faq.update({ where: { id }, data });
  return {
    id: row.id,
    slug: row.slug,
    sortOrder: row.sortOrder,
    category: row.category,
    question: row.question,
    answer: row.answer,
    published: row.published,
  };
}

export async function deleteFaq(id: string): Promise<void> {
  const faq = faqModel();
  if (!faq) {
    throw new Error(
      "FAQ database model is unavailable. Restart the Next.js server after running prisma generate.",
    );
  }
  await faq.delete({ where: { id } });
}
