import { notFound } from "next/navigation";

import CaseStudyTemplate from "@/components/case-study/CaseStudyTemplate";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  return <CaseStudyTemplate caseStudy={caseStudy} />;
}
