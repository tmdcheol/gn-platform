import Directions from "@/components/Directions";
import Hero from "@/components/Hero";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import Strengths from "@/components/Strengths";

export default function Home() {
  return (
    <>
      <Hero />
      <Strengths />
      <Services />
      <Reviews />
      <Directions />
    </>
  );
}
