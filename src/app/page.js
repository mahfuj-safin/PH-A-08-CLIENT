import HeroSlider from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";
import ExtraSections from "@/components/home/ExtraSections";

export const metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <NewArrivals />
      <ExtraSections />
    </>
  );
}