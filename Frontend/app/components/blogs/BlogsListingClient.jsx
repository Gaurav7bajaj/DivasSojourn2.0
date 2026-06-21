"use client";

import { useMemo, useState } from "react";
import BlogFilters from "./BlogFilters";
import BlogGrid from "./BlogGrid";

const defaultVisibleCount = 9;

export default function BlogsListingClient({ blogs }) {
  const [selectedCategory, setSelectedCategory] = useState("All Blogs");
  const [selectedDestination, setSelectedDestination] = useState("All Destinations");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(defaultVisibleCount);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(["All Blogs"]);
    blogs.forEach((blog) => {
      (blog.categories || [blog.category]).forEach((category) => {
        if (!["India", "International", "Europe", "Africa"].includes(category)) {
          uniqueCategories.add(category);
        }
      });
    });
    return Array.from(uniqueCategories);
  }, [blogs]);

  const destinations = useMemo(() => {
    const uniqueDestinations = new Set(["All Destinations"]);
    blogs.forEach((blog) => {
      if (blog.destination) {
        uniqueDestinations.add(blog.destination);
      }
    });
    return Array.from(uniqueDestinations);
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return blogs.filter((blog) => {
      const blogCategories = blog.categories || [blog.category];
      const categoryMatches =
        selectedCategory === "All Blogs" || blogCategories.includes(selectedCategory);
      const destinationMatches =
        selectedDestination === "All Destinations" ||
        blog.destination === selectedDestination ||
        blogCategories.includes(selectedDestination);
      const searchMatches =
        normalizedSearch.length === 0 ||
        blog.title.toLowerCase().includes(normalizedSearch) ||
        blog.excerpt.toLowerCase().includes(normalizedSearch);

      return categoryMatches && destinationMatches && searchMatches;
    });
  }, [blogs, searchQuery, selectedCategory, selectedDestination]);

  const updateCategory = (category) => {
    setSelectedCategory(category);
    setVisibleCount(defaultVisibleCount);
  };

  const updateDestination = (destination) => {
    setSelectedDestination(destination);
    setVisibleCount(defaultVisibleCount);
  };

  const updateSearch = (query) => {
    setSearchQuery(query);
    setVisibleCount(defaultVisibleCount);
  };

  return (
    <section className="bg-[#1A1A1A] px-4 pb-16">
      <div className="mx-auto max-w-7xl">
        <BlogFilters
          categories={categories}
          destinations={destinations}
          selectedCategory={selectedCategory}
          selectedDestination={selectedDestination}
          searchQuery={searchQuery}
          onCategoryChange={updateCategory}
          onDestinationChange={updateDestination}
          onSearchChange={updateSearch}
        />
        <BlogGrid
          blogs={filteredBlogs}
          visibleCount={visibleCount}
          onLoadMore={() => setVisibleCount((count) => count + 6)}
        />
      </div>
    </section>
  );
}
