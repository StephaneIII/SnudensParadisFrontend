"use client";
// Link is used to navigation between Next.js pages.
// useSelector is used to read data from Redux-store.
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Navbar() {
  // State to manage the active category for dropdowns
  const [activeCategory, setActiveCategory] = React.useState(null);

  // Cart
  const cartItems = useSelector(
    (state) => state.cart.items);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity, 0);

  // Authentication
  const user = useSelector((state) => state.auth.user);

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
      <div className="top-header">
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        {/* Linket her bestemmes om man er logget ind eller ej. Hvis man er logget ind, vil man se "Profile" linket, ellers vil man se "Login" linket. */}
        <div className="header-links">
          {user ? (
            <link href="/profile">Profile</link>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
        <Link href="/cart">Cart ({totalItems})</Link>
      </div>

      {/* Bottom Header */}
      <nav className="bottom-header">
        {categories.map((category) => (
          <button
            key={category.name}
            className="category-button"
            onMouseEnter={() => setActiveCategory(category.name)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            {category.name}
            <div className="dropdown">
              {category.links.map((link) => (
                <Link key={link.name} href={link.href}>
                  {link.name}
                </Link>
              ))}
            </div>
          </button>
        ))}
      </nav>

      {/* Dropdown for active category */}
      {activeCategory && (
        <div className="dropdown-menu">
          {categories
            .filter((cat) => cat.name === activeCategory)
            .map((cat) => (
              <div key={cat.name} className="dropdown-content">
                {cat.links.map((link) => (
                  <Link key={link.name} href={link.href}>
                    {link.name}
                  </Link>
                ))}
              </div>
            ))}
        </div>
      )}
    </header>
  );
}