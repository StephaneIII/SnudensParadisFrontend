import Link from "next/link";

// Next.js uses this component as front-page,
// because this file is named app/page.jsx
export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Snudens Paradis</h1>

      <p>Welcome to our online shop! :D</p>

      <Link className="button-link" href="/shop">
          Start shopping
      </Link>
    </div>
  );
}