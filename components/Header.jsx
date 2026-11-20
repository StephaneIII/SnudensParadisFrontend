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
    (state) => state.auth.user);

  // Navigation categories
  const categories = [
    {
      name: "Hunde mad",
      links: [
        { name: "Tørfoder", href: "/shop/hundefoder/tørfoder" },
        { name: "Vådfoder", href: "/shop/hundefoder/vådfoder" },
        { name: "Godbidder", href: "/shop/hundefoder/godbidder" },
      ],
    },
    {
      name: "Hvalp",
      links: [
        { name: "Hvalpefoder", href: "/shop/hvalp/hvalpFoder" },
        { name: "Hvalpe pleje", href: "/shop/hvalp/hvalpPleje" },
        { name: "hvalpe udstyr", href: "/shop/hvalp/hvalpeUdstyr" },
      ],
    },
    {
      name: "Hjemmet",
      links: [
        { name: "Hundesenge", href: "/shop/hjemmet/senge" },
        { name: "Hundeskåle", href: "/shop/hjemmet/skåle" },
        { name: "Rengøring", href: "/shop/hjemmet/rengøring" },
      ],
    },
    {
      name: "pleje",
      links: [
        { name: "Pelspleje", href: "/shop/sundhed/pelspleje" },
        { name: "Tandpleje", href: "/shop/sundhed/tandpleje" },
        { name: "Mave & tarme", href: "/shop/sundhed/mavepleje" },
      ],
    },
    {
      name: "Loppe- & flåtmidler",
      links: [
        { name: "Kamme", href: "/shop/loppe-flåtmidler/kamme" },
        { name: "Kræm", href: "/shop/loppe-flåtmidler/kræm" },
      ],
    },
    {
      name: "Udendørs",
      links: [
        { name: "Halsbånd", href: "/shop/udendørs/halsbånd" },
        { name: "Snore", href: "/shop/udendørs/hundesnor" },
        { name: "Seler", href: "/shop/udendørs/seler" },
        { name: "Mundkurve", href: "/shop/udendørs/mundkurve" },
        { name: "Poser", href: "/shop/udendørs/poser" },
        { name: "Regntøj", href: "/shop/hundetøj/regntøj" },
      ],
    },
    {
      name: "Legetøj",
      links: [
        { name: "Bamser", href: "/shop/legetøj/bamser" },
        { name: "Kaste", href: "/shop/legetøj/kaste" },
        { name: "Tyggeben", href: "/shop/legetøj/tygge" },
      ],
    },
    {
      name: "Transport & Sikkerhed",
      links: [
        { name: "hundetasker", href: "/shop/transportSikkerhed/hundetaske" },
        { name: "Låger & gitter", href: "/shop/transportSikkerhed/låger-gitter" },
        { name: "Transportkasser & -bure", href: "/shop/transportSikkerhed/transportkasser-bure" },
      ],
    },
    {
      name: "Hundetøj",
      links: [
        { name: "Regntøj", href: "/shop/hundetøj/regntøj" },
        { name: "Trøjer", href: "/shop/hundetøj/sweater" },
        { name: "Jakker", href: "/shop/hundetøj/jakker" },
      ],
    },
    {
      name: "Træning",
      links: [
        { name: "Agilityudstyr", href: "/shop/træning/agility" },
        { name: "Fløjter", href: "/shop/træning/fløjter" },
        { name: "godbidtasker", href: "/shop/træning/godbidtasker" },
        { name: "Træningsgodbidder", href: "/shop/hundefoder/godbidder" },
      ],
    }
  ]

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