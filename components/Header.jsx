"use client";
// Link is used to navigation between Next.js pages.
// useSelector is used to read data from Redux-store.
import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
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
    (state) => state.auth?.user);

  // Navigation categories
  const categories = [
    {
      name: "Hunde mad",
      links: [
        { name: "Tørfoder", href: "/shop/dog-food" },
        { name: "Vådfoder", href: "/shop/dog-wet-food" },
        { name: "Godbidder", href: "/shop/dog-treats" },
      ],
    },
    {
      name: "Hvalp",
      links: [
        { name: "Hvalpefoder", href: "/shop/puppy-food" },
        { name: "Hvalpe godbidder", href: "/shop/puppy-treats" },
      ],
    },
    {
      name: "pleje",
      links: [
        { name: "Shampoo", href: "/shop/shampoo" },
        { name: "Børster", href: "/shop/brushes" },
      ],
    },
    {
      name: "Hundetøj",
      links: [
        { name: "Jakker", href: "/shop/jackets" },
        { name: "Sweatshirts", href: "/shop/sweatshirts" },
      ],
    },
    {
      name: "Legetøj",
      links: [
        { name: "Bolde", href: "/shop/balls" },
        { name: "Tyggeben", href: "/shop/chew-toys" },
      ],
    },
    {
      name: "Halsbånd og snore",
      links: [
        { name: "Halsbånd", href: "/shop/collars" },
        { name: "Snore", href: "/shop/leashes" },
      ],
    },
    {
      name: "Træning",
      links: [
        { name: "Træningsudstyr", href: "/shop/training-equipment" },
        { name: "Træningsgodbidder", href: "/shop/training-treats" },
      ],
    }
  ]

  return (
    <header className="header">

      {/* Top Header */}
      <div className="header-top">
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        {/* Linket her bestemmes om man er logget ind eller ej. Hvis man er logget ind, vil man se "Profile" linket, ellers vil man se "Login" linket. */}
        <div className="header-links">
          {user ? (
            <Link href="/profile">Profile</Link>
          ) : (
            <Link href="/login">Login</Link>
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
                    key={link.name} 
                    href={link.href}
                    onClick={() => setActiveCategory(null)}
                    >
                    {link.name}
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