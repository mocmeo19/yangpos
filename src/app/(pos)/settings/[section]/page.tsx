import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrowserBoundary } from '@/components/layout/BrowserBoundary';
import { SettingsSectionScreen } from '@/components/settings/SettingsSectionScreen';
import {
  SETTINGS_SECTION_META,
  SETTINGS_SECTION_ORDER,
} from '@/data/settings-sections';
import { findSettingsSectionBySlug } from '@/lib/settings/find-settings-section-by-slug';

interface SettingsSectionPageProps {
  params: Promise<{ section: string }>;
}

export function generateStaticParams() {
  return SETTINGS_SECTION_ORDER.map((section) => ({
    section: SETTINGS_SECTION_META[section].slug,
  }));
}

export async function generateMetadata({
  params,
}: SettingsSectionPageProps): Promise<Metadata> {
  const section = findSettingsSectionBySlug((await params).section);
  return { title: section ? SETTINGS_SECTION_META[section].title : 'Cài đặt' };
}

export default async function SettingsSectionPage({
  params,
}: SettingsSectionPageProps) {
  const section = findSettingsSectionBySlug((await params).section);
  if (!section) {
    notFound();
  }
  return (
    <BrowserBoundary>
      <SettingsSectionScreen section={section} />
    </BrowserBoundary>
  );
}
