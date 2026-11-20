import Link from "../components/ApiLink";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">
            Velkommen til Snudens Paradis
          </span>

          <h1>Alt det bedste til din bedste ven.</h1>

          <p>
            Find alt, hvad din hund har brug for – fra foder og legetøj
            til tilbehør og udstyr til udendørs eventyr.
          </p>

          <Link className="button-link" href="/shop">
            Gå på opdagelse →
          </Link>
        </div>

        <div className="hero-image">
          <img
            src="/images/hero-dog.jpg"
            alt="Golden retriever, der slapper af i græsset"
          />
        </div>
      </section>
    </div>
  );
}