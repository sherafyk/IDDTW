# Codex Task: Build Payload CMS AI-Enhanced Digital Asset Management System (Sheraf Payload Stack v1)

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

# End of Instructions
