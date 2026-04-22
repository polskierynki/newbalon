import { Footer } from "@/components/site/footer";
import { GallerySection } from "@/components/site/gallery-section";
import { Header } from "@/components/site/header";
import { HeroSection } from "@/components/site/hero-section";
import { ContactSection } from "@/components/site/contact-section";
import { OfferSection } from "@/components/site/offer-section";
import { RevealObserver } from "@/components/site/reveal-observer";
import { TopBar } from "@/components/site/top-bar";
import { WhyUsSection } from "@/components/site/why-us-section";

export default function Home() {
  return (
    <>
      <RevealObserver />
      <TopBar />
      <Header />
      <main>
        <HeroSection />
        <OfferSection />
        <WhyUsSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
