import type { LandingPage } from "@/lib/contentful";
import type { Locale } from "@/lib/i18n";
import {
  isTypeContentGrid,
  isTypeCtaBanner,
  isTypeFaqBlock,
  isTypeFeatureGrid,
  isTypeHeroBlock,
  isTypeImageWithText,
  isTypeRichTextBlock,
  isTypeStatsBlock,
  isTypeTestimonialBlock,
  isTypeVideoEmbed,
} from "@/types/contentful";
import { Hero } from "./hero";
import { RichTextBlock } from "./rich-text-block";
import { FeatureGrid } from "./feature-grid";
import { CtaBanner } from "./cta-banner";
import { Testimonial } from "./testimonial";
import { FaqBlock } from "./faq-block";
import { ImageWithText } from "./image-with-text";
import { StatsBlock } from "./stats-block";
import { ContentGrid } from "./content-grid";
import { VideoEmbed } from "./video-embed";

type Section = NonNullable<LandingPage["fields"]["sections"]>[number];

/** Renders landingPage.sections by content type. Unknown types are skipped. */
export function BlockRenderer({ sections, locale }: { sections?: Section[]; locale: Locale }) {
  return (
    <>
      {sections?.map((section, i) => {
        if (!section) return null;
        const key = `${section.sys.id}-${i}`;
        if (isTypeHeroBlock(section)) return <Hero key={key} entry={section} locale={locale} priority={i === 0} />;
        if (isTypeRichTextBlock(section)) return <RichTextBlock key={key} entry={section} locale={locale} />;
        if (isTypeFeatureGrid(section)) return <FeatureGrid key={key} entry={section} locale={locale} />;
        if (isTypeCtaBanner(section)) return <CtaBanner key={key} entry={section} locale={locale} />;
        if (isTypeTestimonialBlock(section)) return <Testimonial key={key} entry={section} locale={locale} />;
        if (isTypeFaqBlock(section)) return <FaqBlock key={key} entry={section} locale={locale} />;
        if (isTypeImageWithText(section)) return <ImageWithText key={key} entry={section} locale={locale} />;
        if (isTypeStatsBlock(section)) return <StatsBlock key={key} entry={section} locale={locale} />;
        if (isTypeContentGrid(section)) return <ContentGrid key={key} entry={section} locale={locale} />;
        if (isTypeVideoEmbed(section)) return <VideoEmbed key={key} entry={section} locale={locale} />;
        return null;
      })}
    </>
  );
}
