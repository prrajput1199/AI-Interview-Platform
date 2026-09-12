
import { Hero } from '@/components/marketing/Hero'
import { Features } from '@/components/marketing/Features'
import { MarketingNavbar } from '@/components/marketing/marketingNavbar'
import { HowItWorks } from '@/components/marketing/Howitworks '
import { InterviewModes } from '@/components/marketing/interviewModes'
import { CreditsExplainer } from '@/components/marketing/creditsExplainer'
import { FinalCta, Footer } from '@/components/marketing/FinalCTAFooter'

export default function LandingPage() {
  return (
    <div className="bg-bg">
      <MarketingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <InterviewModes />
      <CreditsExplainer/>
      <FinalCta />
      <Footer />
    </div>
  )
}