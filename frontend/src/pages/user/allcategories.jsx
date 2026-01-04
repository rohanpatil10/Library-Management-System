import React, { useState, useEffect } from "react";
import { Server_URL } from "../../utils/config";
import axios from "axios";
import "./allcategories.css";
import { Link } from "react-router-dom";
import Loader from "../../components/Preloader";
import { showErrorToast } from "../../utils/toasthelper";

export default function ViewAllCategories() {
  const [books, setBooks] = useState([]);           // ✅ always array
  const [filterBooks, setFilteredBooks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const url = `${Server_URL}books`;
      const response = await axios.get(url);

      // ✅ Safely extract books
      const apiBooks = Array.isArray(response.data?.books)
        ? response.data.books
        : Array.isArray(response.data)
        ? response.data
        : [];

      setBooks(apiBooks);
      setFilteredBooks(apiBooks);

      // ✅ Build category count safely
      const categoryCountMap = {};
      apiBooks.forEach((book) => {
        if (!book?.category) return;
        categoryCountMap[book.category] =
          (categoryCountMap[book.category] || 0) + 1;
      });

      setCategoryCounts(categoryCountMap);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showErrorToast("Failed to load categories.");
      setBooks([]);
      setFilteredBooks([]);
      setCategoryCounts({});
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (selectedCategory) => {
    setActiveCategory(selectedCategory);

    if (selectedCategory === "All") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) => book?.category === selectedCategory
      );
      setFilteredBooks(filtered);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------- UNIQUE CATEGORIES (SAFE) ----------
  const uniqueCategories = [
    ...new Set(books.map((book) => book?.category).filter(Boolean)),
  ];

  const displayCategories = [
    ...new Set(filterBooks.map((book) => book?.category).filter(Boolean)),
  ];

  return (
    <div className="all-categories-container">
      <div className="all-categories-row">

        {/* Sidebar */}
        <nav className="all-categories-sidebar">
          <h5 className="all-categories-sidebar-title">Categories</h5>

          <ul className="all-categories-nav">
            <li
              className={`all-categories-nav-item ${
                activeCategory === "All" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("All")}
            >
              All
            </li>

            {uniqueCategories.map((category, index) => (
              <li
                key={index}
                className={`all-categories-nav-item ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="all-categories-main">
          <h2 className="all-categories-main-title">
            Explore All Categories
          </h2>

          {loading ? (
            <Loader />
          ) : displayCategories.length > 0 ? (
            <div className="all-categories-grid">
              {displayCategories.map((category, index) => {
                const coverImage = filterBooks.find(
                  (b) => b.category === category
                )?.coverImage;

                return (
                  <div key={index} className="all-categories-card-wrapper">
                    <div className="all-categories-card shadow-sm">
                      <img
                        src={
                          coverImage ||
                          "https://via.placeholder.com/300x400?text=No+Image"
                        }
                        className="all-categories-card-img"
                        alt={category}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x400?text=No+Image";
                        }}
                      />

                      <div className="all-categories-card-body">
                        <h5 className="all-categories-card-title">
                          {category}
                        </h5>
                        <p className="text-muted">
                          Books: {categoryCounts[category] || 0}
                        </p>
                        <Link to="/books" className="all-categories-btn">
                          Explore
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="all-categories-empty">
              <p>No books found in this category.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
