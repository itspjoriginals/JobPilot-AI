# **App Name**: JobPilot AI

## Core Features:

- LinkedIn Automation with Session Injection: Automate LinkedIn job applications using session injection. The system captures user session cookies upon manual login, stores them encrypted (AES-256) in Firestore, and uses Playwright/Puppeteer with injected sessions. Implements residential proxies, headless browser fingerprinting, and human-like behavior simulation (typing delays, scrolling, randomized actions) to prevent account bans.
- Standardized Job Ingestion Pipeline: A complete pipeline for job feeds, including scraping/API fetching, normalization to a unified JobSchema, hash-based deduplication, proxy rotation system, and frequency scheduler (cron). Normalized jobs are stored in Firestore, triggering the matching engine after ingestion. The pipeline ensures reliable job aggregation across platforms.
- Structured Screening Question Storage: A structured field 'savedAnswers' is added to the user profile to store pre-generated answers to screening questions. The 'savedAnswers' array contains objects with 'pattern' (question pattern), 'generatedAnswer' (the answer), and 'updatedAt' (timestamp). This feature is crucial for auto-filling common questions during the application process.
- Resume Parsing Correction Workflow: Implements a 'Review Parsed Resume' step, allowing users to edit their parsed resume section-by-section. Features include skill grouping (technical, tools, soft skills), experience date correction, project tagging, and overlap detection in timelines. Ensures users verify the AI-parsed data before automation.
- Behavior-Based Matching Input: Extends the job matching engine inputs with data points such as jobs the user applied to, skipped, or saved, and their interaction patterns. These data points are used to dynamically adjust future matching scores.
- Cloud Task Queue System for Automation: Utilizes a distributed queue system with Firebase Cloud Functions, Cloud Tasks Queue, and Pub/Sub (optional) to manage automation jobs at scale. Tasks include auto-apply attempts, scraper runs, matching engine execution, and notification triggers.
- Data Encryption Layer: Defines stringent encryption requirements: AES-256 for cookies and sensitive fields, encrypted Firestore fields for resume data, answers, salary, and tokens. JWT encryption is used for session handling to prevent data breaches.
- Legal Consent and Permissions Module: A mandatory consent flow is implemented, requiring users to explicitly accept automation on their behalf, approve the storage of session data, acknowledge platform risks (LinkedIn/Naukri, etc.), and accept auto-generated answers to screening questions, thereby mitigating legal liability.
- Error Recovery and Retry System: Every automation job includes 'retryCount', 'errorType', 'errorDetails', and a screenshot capture of the failure state. The system attempts auto-retry ×3 and escalates to the user via notification, ensuring robust error handling.
- Admin Monitoring Dashboard: A comprehensive dashboard that tracks scraper health, automation job success rate, proxy performance, session expiry alerts, and high rejection-pattern alerts, facilitating proactive system maintenance.
- Chrome Extension Support: A Chrome extension allows for on-page job parsing, triggering 'One-click Apply,' and syncing with Firestore. It provides a local browser automation context to reduce bot detection. This enhances user experience and reduces bot detection.
- Apply Strategy Modes: Introduces profile settings for 'Aggressive' (60%+ match), 'Balanced' (75%+ match), and 'Targeted' (85-90% match) apply strategies, allowing users to control how many jobs the auto-apply engine targets daily based on match quality.
- Job Application Daily Limit: A configurable daily apply cap, defaulting to 20/day, is implemented to avoid LinkedIn rate limiting. Users can adjust this limit based on their risk tolerance.
- Resume Version Control: Users can upload multiple resumes, each with a name, file URL, parsed data, and creation timestamp. The system selects the best resume per job based on relevancy.
- Anti-Bot Detection Logic: Implements randomized intervals, human cursor simulation, time-windowed apply slots (9 AM – 6 PM), browser fingerprinting, and random page scroll before apply to protect users from shadow bans.
- Dark Mode and High-Contrast Layers: The UI offers both light mode (default teal theme) and dark mode options, with strong contrast for cards, borders, and hovers to enhance accessibility.
- Job Health Monitoring System: The backend detects and logs low job availability, high scraping failure, high automation error rates, and platform changes requiring script updates to maintain system reliability.
- Extended Job Detail Schema: Adds fields like 'canonicalCompanyName', 'canonicalJobTitle', 'remoteType', 'seniorityLevel', 'jobScore', 'scrapeSource', 'hashId', and 'applyMethod' (easy_apply / external / email) to unify all job sources and improve data consistency.
- Unified Automation Log Schema: Includes an 'automationLog' array with 'jobId', 'status' (success / failed / skipped), 'errorType', 'timestamp', and 'screenshotUrl' for each application attempt, providing detailed auditing and error tracking.

## Style Guidelines:

- Primary color: Saturated teal (#469990) to give a techy, modern but soothing feeling.
- Background color: Very light desaturated teal (#F0F8F7).
- Accent color: Analogous, brighter, less saturated teal (#55BDB1) for highlighting CTAs and important info.
- Headline font: 'Space Grotesk' (sans-serif) for a computerized, techy feel
- Body font: 'Inter' (sans-serif) for a modern, neutral look
- Minimalist icons that represent various job search actions and statuses.
- Clean, card-based layout to organize job listings and application statuses.
- Dark Mode + High-Contrast Layers. The UI offers both light mode (default teal theme) and dark mode options, with strong contrast for cards, borders, and hovers to enhance accessibility.