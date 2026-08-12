import Hero from "@/components/Hero";
import ServiceShowcase from "@/components/ServiceShowcase";
import Features from "@/components/Features";
import JoinPortals from "@/components/JoinPortals";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020A24] via-[#061547] to-[#020A24] text-white relative overflow-hidden">
      {/* Ambient Light Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/25 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-[400px] left-1/4 w-[500px] h-[400px] bg-cyan-500/20 blur-[140px] pointer-events-none rounded-full" />

      <Hero />
      <ServiceShowcase />
      <Features />
      <JoinPortals />
      <Footer />
    </main>
  );
}
