# Dhamari Village Archive

A bilingual, evidence-led public-history website for Dhamari village, Shirur taluka, Pune district, Maharashtra.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Upload the contents of `dist` to any static web host.

## Editorial rule

The archive separates documented facts, supported field assessments and oral-history leads. A local tradition is not presented as proven history without a primary source.

## Database

The `supabase/migrations` folder contains the starter schema. Public clients receive read-only access to published entries. Keep secret or service-role keys outside the browser and source control.

## Daily information automation

The daily workflow searches the Dhamari-related queries in `automation.config.json`, removes duplicate links, tests and builds the site, and commits a changed candidate feed directly to `main`. Every automated candidate is labelled **पडताळणी प्रलंबित** and is rendered separately from curated factual claims.

The workflow runs at `17 5 * * *` UTC (10:47 a.m. IST) and can also be started manually. Its commit triggers the Pages deployment through `workflow_run`. Editors must inspect a linked source before promoting an automated candidate into curated archive content.

Repository administrators must enable: **Repository → Settings → Actions → General → Workflow permissions → Read and write permissions**. If `main` has branch protection, allow GitHub Actions to push this single generated JSON file or retain a manual review workflow instead.
