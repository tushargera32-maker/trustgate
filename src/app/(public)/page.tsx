import { Hero } from "@/components/home/hero";
import {
  TrustBand,
  Destinations,
  VisaServices,
  Process,
  EligibilityCta,
  SuccessStories,
  UpdatesPreview,
  BlogPreview,
  ConsultationCta
} from "@/components/home/sections";

/**
 * Homepage order follows the reader's actual question sequence:
 * who are you → where can you help → what does it cost me to find out →
 * how does it work → does it work for people like me → are you current.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBand />
      <Destinations />
      <VisaServices />
      <EligibilityCta />
      <Process />
      <SuccessStories />
      <UpdatesPreview />
      <BlogPreview />
      <ConsultationCta />
    </>
  );
}
