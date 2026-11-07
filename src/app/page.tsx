import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TreatmentDrawerProvider } from "@/components/interactive/TreatmentDrawer";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Treatments } from "@/components/sections/Treatments";
import { Journey } from "@/components/sections/Journey";
import { Explorer } from "@/components/sections/Explorer";
import { Technology } from "@/components/sections/Technology";
import { Gallery } from "@/components/sections/Gallery";
import { Team } from "@/components/sections/Team";
import { Values } from "@/components/sections/Values";
import { Booking } from "@/components/sections/Booking";
import { Faq } from "@/components/sections/Faq";
import { Finale } from "@/components/sections/Finale";

export default function Home() {
  return (
    <TreatmentDrawerProvider>
      <Header />
      <main id="conteudo">
        <Hero />
        <Manifesto />
        <Treatments />
        <Journey />
        <Explorer />
        <Technology />
        <Gallery />
        <Team />
        <Values />
        <Booking />
        <Faq />
        <Finale />
      </main>
      <Footer />
    </TreatmentDrawerProvider>
  );
}
