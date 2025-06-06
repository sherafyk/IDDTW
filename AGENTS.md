# Codex Task 1: Build Payload CMS AI-Enhanced Digital Asset Management System (Sheraf Payload Stack v1)

---

## Context

I am building a professional, AI-enhanced Digital Asset Management (DAM) system that will serve both internal use and potential future SaaS expansion. This system will manage media assets including images, SVG files, Lottie animations, PDFs, videos, and other media formats. Each asset will be enriched using OpenAI to generate descriptive metadata, alt text, and tags for high retrievability and semantic search.

The system will be hosted on my VPS (Debian 12, Apache, ISPConfig), deployed via Docker Compose using a clean GitHub repository that serves as my master deployment source. The frontend will not be built at this time; this phase is strictly focused on building the backend CMS, AI enrichment pipeline, and deployment architecture.

You are tasked to build this full system using Payload CMS, fully optimized for AI-powered enrichment, future SaaS scalability, and clean, modern code architecture.

---

## Build Constraints & Environment

* VPS OS: Debian 12
* Web Server: Apache (ISPConfig-managed)
* Deployment Flow: Code lives on GitHub, deployed to VPS via `git clone` and `docker compose up -d`.
* Docker: Fully dockerized stack with isolated containers.
* Reverse Proxy: Apache will proxy external traffic to Payload container.
* AI Provider: OpenAI GPT-4o (`https://api.openai.com/v1/chat/completions`)
* No frontend required at this stage.
* Clean, scalable repository structure.

---

## Build Path

---

### Phase 1: Repository Structure & Deployment Foundation

You will generate a fully self-contained GitHub repository with the following structure:

```bash
/ (repo root)
  /payload/            # Payload CMS app files and configurations
  /services/ai/        # AI enrichment service code
  /uploads/            # File storage (Docker-mounted volume)
  /db/                 # MongoDB storage volume
  docker-compose.yml
  .env.example
  package.json
  README.md
```

---

### Phase 2: Payload CMS Core Deployment

1. Initialize Payload CMS app inside `/payload/`.
2. Admin panel accessible at `/admin` route.
3. Payload secret, database URI, and file upload paths should be environment-variable driven.
4. Expose Payload CMS internally on Docker port `3000`.

#### File Upload Storage

* Use Payload’s built-in local file storage adapter.
* Store files under `/uploads/` (Docker-mounted volume).
* Structure uploaded files by date: `/uploads/YYYY/MM/DD/filename.ext`.

#### Docker Compose Deployment

* Docker Compose should define:

  * Payload CMS container
  * MongoDB container
* Docker volumes for:

  * File uploads: `./uploads:/uploads`
  * MongoDB: `./db:/data/db`

#### Apache Reverse Proxy

* Codex does not need to build Apache config, but include example config in README.md:

```apache
<VirtualHost *:443>
    ServerName xaio.org
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

---

### Phase 3: Payload CMS Schema Design (Collections & Fields)

#### Primary Collection: MediaAsset

| Field         | Type                                          | Notes                                       |
| ------------- | --------------------------------------------- | ------------------------------------------- |
| `title`       | Text                                          | AI-generated, editable                      |
| `description` | Textarea                                      | Optional manual field                       |
| `file`        | Upload                                        | File storage                                |
| `altText`     | Text                                          | AI-generated alt text                       |
| `tags`        | Relationship (many-to-many to Tag collection) | AI-generated tags                           |
| `fileType`    | Select                                        | Enum: Image, SVG, Lottie, Video, PDF, Other |
| `source`      | URL                                           | Optional original source                    |
| `uploadedBy`  | User reference                                | Internal user model                         |
| `createdAt`   | Auto Timestamp                                |                                             |
| `updatedAt`   | Auto Timestamp                                |                                             |

#### Secondary Collection: Tag

| Field  | Type | Notes                        |
| ------ | ---- | ---------------------------- |
| `name` | Text | Unique label                 |
| `slug` | Text | Auto-generated URL-safe slug |

---

### Phase 4: AI Metadata Enrichment Pipeline

#### Hook Logic

* Use Payload’s `afterChange` hook on MediaAsset collection.
* Trigger enrichment only on new file uploads or when file is changed.
* Enrichment fields: title, alt text, tags.

#### OpenAI Integration

* Use OpenAI `chat/completions` API with model `gpt-4o`.
* Base URL: `https://api.openai.com/v1/chat/completions`
* Use `temperature: 0.7` to balance creativity with consistency.
* Load OpenAI API key from environment variable `OPENAI_API_KEY`.

#### Prompt Design

##### Title Prompt:

> You are a content metadata generator. Given a file name and basic info, create a short, professional, descriptive title suitable for a digital asset library.

##### Alt Text Prompt:

> You are an alt text generator. Write ADA-compliant alt text for this file that accurately describes the content for visually impaired users.

##### Tag Prompt:

> You are a tagging system. Generate 5-10 highly relevant search tags describing this media file.

#### AI Code Structure

* Create a dedicated AI service module: `/services/ai/aiService.js`
* Export separate async functions:

  * `generateTitle()`
  * `generateAltText()`
  * `generateTags()`
* Functions should be easily reusable and accept the filename and any available metadata.
* Handle OpenAI API requests cleanly with error handling, retries, and token limits.
* Insert enrichment results directly into Payload fields via hook update.

#### Safe Overrides

* Admin should be able to manually edit AI-generated fields after upload.

---

### Phase 5: SaaS Readiness Architecture

* Build backend using best-practice modular design to enable:

  * Role-based access control (admins, uploaders, read-only users)
  * Future subscription models (Stripe integration via Payload plugin)
  * External API endpoints for public consumption.
* Structure code for future integrations but do not build frontend or SaaS billing system yet.

---

### Phase 6 (Optional Future Expansion — Not for This Build)

* Add CDN offload for serving large files.
* Build public-facing frontend (Next.js or Astro) that consumes Payload API.
* Build semantic search using vector embeddings (OpenAI ADA or Claude embeddings).
* REST API for partner integrations.
* User SaaS billing model using Stripe plugins.

---

## Deliverables to Generate

* Fully functional GitHub repository per structure above.
* Complete Payload CMS initialization.
* Clean Docker Compose deployment.
* Full schema definitions for `MediaAsset` and `Tag` collections.
* AI enrichment hook code integrated with Payload lifecycle.
* OpenAI API service module.
* `.env.example` file to document required variables.
* README.md with full deployment instructions.
* Apache reverse proxy example configuration.

---

## Example Environment File (.env.example)

```env
OPENAI_API_KEY=your-openai-api-key
PAYLOAD_SECRET=your-payload-secret
MONGODB_URI=mongodb://mongo:27017/payload
UPLOAD_DIR=/uploads
PORT=3000
```

---

## Deployment Flow (for README.md)

```bash
git clone <repo_url>
cd <repo>
cp .env.example .env
# Edit .env and add your secrets
docker compose up -d
```

---

## Key Notes for Codex

* Code must be modular, maintainable, and cleanly separated.
* All credentials and file paths controlled via `.env`.
* Use best-practice API call structure with clean retries and error handling.
* All file paths inside Docker context — avoid direct VPS hardcoded paths.
* Assume the user is experienced and capable of VPS management.
* Do not include any frontend UI code.
* Do not generate SaaS payment logic yet.
* Build for long-term maintainability.

---

## Bonus Context

* The system will ultimately serve as a core SaaS platform for media asset licensing.
* Scalability, data integrity, and AI extensibility are mission critical.
* Design architecture as if this system could evolve into a commercial-grade SaaS offering.
* Simplicity + extensibility is prioritized.
* Codex should optimize for industry-grade engineering standards.

---

# End of Instructions for Codex Task 1

---
---
---

# Codex Task 2: Build Frontend Scaffold for Payload CMS Digital Asset Management (Sheraf Payload Stack v2 — Public Frontend)

---

## Context

You are tasked to build the full frontend scaffold for my AI-enhanced Digital Asset Management (DAM) system, using Payload CMS as the backend (already deployed via Docker as Phase 1). The frontend will serve as the public-facing `xaio.org` website for browsing, searching, filtering, and viewing digital media assets.

This scaffold will consume data exclusively from Payload CMS’s REST API endpoints via secure HTTPS calls. You are not responsible for any backend code or Payload hooks in this task — strictly the frontend build scaffold.

---

## Stack Selection

* Frontend Framework: Next.js (latest LTS)
* Styling: Tailwind CSS
* Deployment-Ready for:

  * Vercel (preferred)
  * or self-hosted on VPS reverse proxy (future option)
* Strictly frontend — decoupled from backend hosting.
* API Source: Payload CMS REST API

---

## API Endpoint Reference

* Payload CMS API Base URL: `https://api.xaio.org/api/`
* MediaAsset Collection API: `https://api.xaio.org/api/media-assets`
* Tag Collection API: `https://api.xaio.org/api/tags`
* Auth: Start fully public for read-only access. (No JWT auth yet.)

---

## Core Features to Scaffold

### 1️⃣ Landing Page (`/`)

* Clean professional homepage.
* Brief system intro text placeholder.
* Call-to-action to browse the asset library.
* Minimalistic modern aesthetic.

### 2️⃣ Media Library Browser (`/library`)

* Paginated list view of MediaAssets.
* Display:

  * Thumbnail (from file)
  * Title
  * FileType label
  * Tags (as clickable chips)
* Clicking a tag filters by that tag.

### 3️⃣ Media Detail View (`/library/[id]`)

* Display full asset details:

  * Full preview (image, svg, video player, pdf viewer where applicable)
  * Title
  * Description
  * AltText
  * Tags (clickable)
  * Source URL (if present)
  * Download button

### 4️⃣ Tag Browser (`/tags`)

* List all tags.
* Clicking a tag links to `/library?tag=selectedtag`.

### 5️⃣ Search Bar (Global Header)

* Simple text-based search querying:

  * Title
  * Description
  * Tags
* Use query params to pass search state (`/library?search=...`).

---

## Data Fetching

* Use Next.js native data fetching (preferably `getServerSideProps` or `app router` if using Next 13+).
* Use Axios or native fetch to call Payload CMS API endpoints.
* Build reusable API wrapper layer inside `/lib/api.js` to simplify all Payload API calls.
* Handle API errors gracefully.
* Pagination parameters via query params.

---

## Visual Styling & UI Components

* Use Tailwind CSS for all layouts.
* Use component-based structure:

  * `components/Header.js`
  * `components/Footer.js`
  * `components/AssetCard.js`
  * `components/SearchBar.js`
  * `components/TagChip.js`
* Create basic responsive design — mobile-friendly.
* Use placeholder logo & colors.

---

## Project Structure

```bash
/ (repo root)
  /components/
  /pages/
    index.js
    /library/
      index.js
      [id].js
    /tags/
      index.js
  /lib/
    api.js
  /public/
    /logo/ (placeholder logos, favicon)
  tailwind.config.js
  package.json
  .env.local.example
  README.md
```

---

## Environment Variables

Provide a `.env.local.example`:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.xaio.org/api
```

---

## Deployment Preparation

* Fully compatible with Vercel deployment.
* Build clean SSR + static hybrid output.
* Future: can move to VPS hosting if desired.

---

## SaaS-Readiness Architecture

* Build scaffold so that future versions can easily add:

  * User authentication
  * Subscription billing (Stripe)
  * Private asset access by user role
  * Favorites / collections per user
  * Usage tracking
  * AI-powered semantic search

---

## Key Notes for Codex

* You are building scaffold code that will serve as v1 frontend.
* This is not a UI mockup; full production-grade React+Next.js code.
* Keep code modular, maintainable, and scalable.
* Follow Next.js best practices.
* Build for clean maintainability: clear component folders, API wrappers, reusable layouts.
* Build for long-term SaaS extensibility.
* Prioritize high code quality.
* No backend code is needed — only frontend API calls.
* No payment system required yet.

---

## Bonus Context

* This frontend will serve as public storefront for AI-powered searchable media assets.
* SaaS expansion is planned; clean code now saves time later.
* Assume the backend Payload CMS is fully deployed, functioning, and accessible via public API.

---

# End of Instructions for Codex Task 2

