"use client";
// Link is used to navigation between Next.js pages.
// useSelector is used to read data from Redux-store.
import { useState } from "react";
import Link from "./ApiLink";
import { useSelector } from "react-redux";
import { categories, categorySlug } from "../app/shop/categories";
import "./Header.css"; // Import the CSS file for styling

export default function Header() {
  // State to manage the active category for dropdowns
  const [activeCategory, setActiveCategory] = useState(null);

  // Cart
  const cartItems = useSelector(
    (state) => state.cart.items);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity, 0);

  // Authentication
  const user = useSelector(
    (state) => state.auth.user);

  return (
    <header className="header">

      {/* Top Header */}
      <div className="header-top">
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <div className="header-links" lang="da">
          {user ? (
            <>
              <Link href="/profile">Profil</Link>
              <Link href="/login">Log ud</Link>
            </>
          ) : (
            <Link href="/login">Log ind</Link>
          )}
        </div>
        <Link href="/cart">Cart ({totalItems})</Link>
      </div>

      {/* Bottom Header */}
      <nav className="header-bottom">
        {categories.map((category) => (
          <div
            key={category.name}
            className="category-container"
            onMouseEnter={() => setActiveCategory(category.name)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <button className={`category-button ${
              activeCategory === category.name
               ? "active" 
               : ""
            }`}
            aria-expanded={activeCategory === category.name}
            >
              {category.name}
            </button>

          {/* Dropdown for active category */}
          {activeCategory === category.name && (
            <div className="dropdown-menu">
              <div className="dropdown-menu-content">
                {category.links.map((link) => (
                  <Link
                    key={link}
                    href={`/shop/kategori/${categorySlug(link)}`}
                    onClick={() => setActiveCategory(null)}
                    >
                    {link}
                  </Link>
                  ))
                }
              </div>
            </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
}