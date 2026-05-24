import Hero from "./components/Hero";
import HomeClient from "./components/HomeClient";
import SupportStrip from "./components/home/SupportStrip";
import Footer from "./components/home/Footer";

export default function Home() {
  return (
    <main className="min-h-screen scf-bg">
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <Hero />

        <div className="mt-5">
          <HomeClient />
        </div>

        <div className="mt-6">
          <SupportStrip />
        </div>
      </div>

      <Footer />
    </main>
  );
}