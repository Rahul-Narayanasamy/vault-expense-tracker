import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import {
  CTASection,
  FeaturesSection,
  HeroSection,
} from "@/features/marketing/components/landing-sections";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <MarketingFooter />
    </div>
  );
}
