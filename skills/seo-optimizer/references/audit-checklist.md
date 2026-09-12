# SEO audit checklist

## Evidence lanes

Classify every finding as one of:

- **Confirmed locally:** directly observed in supplied HTML, code, exports, or configuration.
- **Needs live verification:** requires a crawler, browser, Search Console, analytics, server logs, or production headers.
- **Recommendation:** a content or information-architecture change justified by audience intent, not a guaranteed ranking tactic.

## High-signal checks

| Area | Check | Typical evidence |
| --- | --- | --- |
| Crawl | status, redirects, robots, sitemap, canonical | crawler/export, headers, files |
| Page | title, description, H1, headings, content usefulness | rendered HTML, template review |
| Links | important pages reachable, descriptive anchors, broken links | crawl and internal-link map |
| Media | meaningful alt text, responsive dimensions, compression | HTML and performance trace |
| Structured data | valid type, values match visible content | JSON-LD and validator output |
| Local | consistent name/address/phone, service area, location intent | business profile and site |
| Ecommerce | product facts, availability, price, breadcrumbs, variants | product templates/feed |
| Performance | mobile layout, loading, interaction, third-party cost | field/lab measurements |

Score a fix with impact, confidence, effort, and risk. A technically correct change that harms accessibility, truthfulness, or user comprehension is not an SEO improvement.
