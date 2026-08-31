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

## Reviewed information automation

The daily workflow searches the Dhamari-related queries in `automation.config.json`, removes duplicate links, and writes candidates only to `src/data/internetUpdates.json`. Every candidate is labelled **पडताळणी प्रलंबित** and is rendered as an automated reference—not as a verified factual claim.

The workflow runs at `17 5 * * *` UTC and can also be started manually. It opens or updates a review pull request; it never publishes a claim directly. Editors must inspect the linked source before promoting any candidate into archive content. To run the search locally, use `npm run update:information` (this changes the candidate JSON and should not be used merely for validation).

Repository administrators must enable: **Repository → Settings → Actions → General → Workflow permissions → Read and write permissions → Allow GitHub Actions to create and approve pull requests**.
