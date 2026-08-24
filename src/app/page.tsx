import RippleHero from "@/components/hero/RippleHero";
import AboutSection from "@/components/about/AboutSection";
import CapabilitiesSection from "@/components/capabilities/CapabilitiesSection";
import ManifestoSection from "@/components/manifesto/ManifestoSection";
import OffScreenSection from "@/components/off-screen/OffScreenSection";
import OutroSection from "@/components/outro/OutroSection";
import PlaygroundSection from "@/components/playground/PlaygroundSection";
import SignpostSection from "@/components/signpost/SignpostSection";
import SelectedWorkSection from "@/components/work/SelectedWorkSection";

export default function Home() {
  return (
    <>
      <RippleHero />
      <ManifestoSection />
      <SelectedWorkSection />
      <PlaygroundSection />
      <SignpostSection />
      <OffScreenSection />
      <CapabilitiesSection />
      <AboutSection />
      <OutroSection />
    </>
  );
}
