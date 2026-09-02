/**
 * Serves /ai/summary.json (via rewrite) – authoritative summary for AI crawlers.
 *
 * Provides a short (<800 characters) summary so AI systems can understand what the site
 * is about. Application/json, Cache-Control 24h. Publicly accessible.
 */

import { aiJsonResponse } from '@/lib/ai-json-response';

const MAX_DESCRIPTION_LENGTH = 800;

export interface SummaryJsonPayload {
  title: string;
  description: string;
  lastModified: string;
}

/**
 * Ensures description does not exceed max length (requirement: MUST NOT exceed 800 characters).
 */
function ensureDescriptionLength(description: string, maxLength: number): string {
  const trimmed = description.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength - 3) + '...';
}

export async function GET() {
  const description = `Lalandia is a Sitecore AI head application for Denmark's Lalandia holiday centres. Book holiday homes with tropical Aquadome water parks in Søndervig, Billund and Rødby — family activities, dining, offers and school-holiday stays. Built with Next.js App Router and the Sitecore Content SDK.`;

  const payload: SummaryJsonPayload = {
    title: 'Lalandia',
    description: ensureDescriptionLength(description, MAX_DESCRIPTION_LENGTH),
    lastModified: new Date().toISOString(),
  };

  return aiJsonResponse(payload);
}
