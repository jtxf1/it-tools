import { defineConfig } from 'figue';
import { z } from 'zod';

export const { config } = defineConfig(
  {
    app: {
      version: {
        doc: 'Application current version',
        schema: z.string(),
        default: '0.0.0',
        env: 'PACKAGE_VERSION',
      },
      lastCommitSha: {
        doc: 'Application last commit SHA version',
        schema: z.string(),
        default: '',
        env: 'VITE_VERCEL_GIT_COMMIT_SHA',
      },
      baseUrl: {
        doc: 'Application base url',
        schema: z.string(),
        default: '/',
        env: 'BASE_URL',
      },
      env: {
        doc: 'Application current env',
        schema: z.enum(['production', 'development', 'preview', 'test']),
        default: 'development',
        env: 'VITE_VERCEL_ENV',
      },
    },
    plausible: {
      isTrackerEnabled: {
        doc: 'Is the tracker enabled',
        schema: z.boolean(),
        default: false,
        env: 'VITE_TRACKER_ENABLED',
      },
      domain: {
        doc: 'Plausible current domain',
        schema: z.string(),
        default: '',
        env: 'VITE_PLAUSIBLE_DOMAIN',
      },
      apiHost: {
        doc: 'Plausible remote api host',
        schema: z.string(),
        default: '',
        env: 'VITE_PLAUSIBLE_API_HOST',
      },
      trackLocalhost: {
        doc: 'Enable or disable localhost tracking by plausible',
        schema: z.boolean(),
        default: false,
      },
    },
    showBanner: {
      doc: 'Show the banner',
      schema: z.boolean(),
      default: false,
      env: 'VITE_SHOW_BANNER',
    },
    showSponsorBanner: {
      doc: 'Show the sponsor banner',
      schema: z.boolean(),
      default: false,
      env: 'VITE_SHOW_SPONSOR_BANNER',
    },
  },
  {
    envSource: {
      PACKAGE_VERSION: import.meta.env.PACKAGE_VERSION,
    },
  },
);
