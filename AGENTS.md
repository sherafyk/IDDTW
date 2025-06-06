# Codex Task: Build Payload CMS Digital Asset Management System

## Context

I am building a professional AI-enhanced Digital Asset Management (DAM) system for internal and future SaaS use. This project will be hosted on my VPS (Debian 12, Apache, ISPConfig), and will manage media assets (images, SVG files, Lottie animations, etc) with rich metadata, auto-generated AI titles, alt-text, and tags. The platform should have an elegant interface, highly structured metadata, easy search, download, and linking capabilities. Initially private, but future-ready for user access, subscriptions, and payments.

You are to help me build this system using **Payload CMS**, fully optimized for AI-powered metadata enrichment, future SaaS scalability, and clean code architecture.

---

## Build Constraints & Environment

* VPS with Debian 12, Apache, ISPConfig 3.
* Public web root example path: `/var/www/clients/client0/web4/web/`
* Payload CMS will run under Docker, reverse proxied by Apache.
* All uploaded assets will initially be stored on local disk (S3 not needed yet).
* Future SaaS potential: user management, payments, API access.

---

## Build Path

---

### Phase 1: Core Payload CMS Deployment

1. **Set up Dockerized Payload CMS on VPS**

   * Use official Payload CMS Docker instructions:

     * [https://payloadcms.com/docs/production/deployment#docker](https://payloadcms.com/docs/production/deployment#docker)
   * Docker should be installed on Debian 12 VPS.
   * Payload instance should run on internal port `18080`.
   * Apache reverse proxy configuration to expose Payload:

     * For example: `https://assets.mydomain.com` or `https://xaio.org`

2. **File Storage**

   * Use Payload's default local file storage plugin.
   * Store all uploaded files under:

     * `/var/www/clients/client0/web4/assets/`
   * Make sure permissions allow Payload Docker container to write to this path.
   * Structure uploads by date: `/assets/YYYY/MM/DD/filename.ext`

3. **Database**

   * Use MongoDB Docker container.
   * Either local MongoDB in Docker Compose or external MongoDB Atlas.
   * Ensure proper Mongo credentials, persistence, backups.

---

### Phase 2: Payload CMS Schema Design (Collections & Fields)

**Main Collections:**

#### MediaAsset (Primary Collection)

| Field         | Type                                          | Notes                                  |
| ------------- | --------------------------------------------- | -------------------------------------- |
| `title`       | Text                                          | Auto-generated, editable               |
| `description` | Textarea                                      | Optional manual description            |
| `file`        | Upload                                        | Payload file upload                    |
| `altText`     | Text                                          | AI-generated alt text                  |
| `tags`        | Relationship (Many-to-Many to Tag Collection) | AI-generated tags                      |
| `fileType`    | Select                                        | Enum: Image, SVG, Lottie, Video, Other |
| `source`      | URL                                           | Optional original source link          |
| `uploadedBy`  | User reference                                | Internal user system                   |
| `createdAt`   | Auto Timestamp                                |                                        |
| `updatedAt`   | Auto Timestamp                                |                                        |

#### Tag (Secondary Collection)

| Field  | Type                  | Notes            |
| ------ | --------------------- | ---------------- |
| `name` | Text                  | Unique tag label |
| `slug` | Text (Auto-generated) | URL safe         |

---

### Phase 3: AI Metadata Enrichment Pipeline

1. **Hook Trigger**

   * On successful asset upload (after file stored), trigger Payload `afterChange` hook.

2. **AI Tasks (Using OpenAI API):**

   * Generate:

     * Title
     * Alt text
     * Descriptive tags (10 max)

3. **API Prompts:**

   * Title Prompt:

     > You are a content metadata generator. Given this file name and basic info, create a short, descriptive professional title suitable for digital asset libraries.
   * Alt Text Prompt:

     > You are an alt text generator. Write accurate, ADA-compliant alt text for this file.
   * Tag Prompt:

     > You are a tagging system. Generate 5-10 highly relevant tags describing this media file for search purposes.

4. **Store Outputs**

   * Inject AI responses into Payload collection fields automatically via hook update.

5. **Safe Overrides**

   * Allow manual editing of AI fields after upload.

---

### Phase 4: Elegant Frontend Interface (Admin-Only for Now)

* Use Payload's built-in Admin UI for private internal access.
* Ensure Admin UI is fully operational via reverse proxy over HTTPS.
* No public frontend needed at this stage.

---

### Phase 5: SaaS Readiness Architecture

* Keep multi-user system structure:

  * Admins
  * Uploaders
  * Read-only users
* Implement role-based access control using Payload’s built-in Access Control.
* Future Stripe integration via Payload plugin for SaaS paywall.

---

### Phase 6 (Optional Future Expansion - not for immediate build)

* Add CDN offload for file delivery.
* Build public-facing Next.js or Astro frontend.
* Add search powered by vector embeddings (OpenAI ADA or Claude embeddings) for highly semantic search.
* Build REST API endpoints for partner integrations.

---

## Deliverables to Generate

1. Docker Compose file for VPS deployment.
2. Payload CMS schema for MediaAsset and Tag collections.
3. Payload CMS backend hooks (Node.js) for AI enrichment.
4. Apache reverse proxy config for Payload Docker container.
5. API integration for OpenAI / Claude calls.
6. Documentation for all of the above.

---

## Key Notes for Codex

* Prioritize clean code, modular functions, and clear separation of config variables.
* Ensure database credentials, API keys, and file paths are handled via environment variables for security.
* Design backend code so that AI enrichment hooks are self-contained and easy to update.
* Codebase should be deployment-ready to VPS file paths as described.

---

## Example File Paths (VPS context for ISPConfig deployment)

| Purpose                              | Path Example                                    |
| ------------------------------------ | ----------------------------------------------- |
| Web Root (reverse proxy points here) | `/var/www/clients/client0/web4/web`             |
| Upload Storage                       | `/var/www/clients/client0/web4/assets/`         |
| Docker Compose Location              | `/var/www/clients/client0/web4/payload-docker/` |

---

## Bonus Context

* Assume I am technically capable but looking for best practice design patterns.
* Future maintainability and SaaS expansion matter.
* Keep AI prompt engineering easily editable for future tuning.

---

# End of Instructions

---
