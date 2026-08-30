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
