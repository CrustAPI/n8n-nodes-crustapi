# n8n-nodes-crustapi

This is an n8n community node. It lets you use [CrustAPI](https://crustapi.com) in your n8n workflows.

CrustAPI returns Google and public LinkedIn data as clean JSON. Google covers web search, Maps, Reviews, News, Shopping, Images, Videos, Places, and webpage scraping. LinkedIn covers public profiles, company pages, posts, jobs, and people search. You only pay for successful results, and empty searches are free.

[Installation](#installation) · [Operations](#operations) · [Credentials](#credentials) · [Usage](#usage)

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/). Search for **n8n-nodes-crustapi** in the in-app nodes panel, or install it manually.

## Operations

One node, pick the surface with the **Operation** dropdown:

- **Web Search** — Google organic results
- **Maps** — local businesses with rating, review count, phone, and website
- **Reviews** — Google reviews for a business, sortable
- **News** — Google News headlines with images and snippets
- **Shopping** — product listings with price, seller, and condition
- **Images**, **Videos**, **Places**
- **Scrape Webpage** — turn any URL into clean text and metadata
- **LinkedIn Profile / Company / Posts / Jobs / People Search**: public LinkedIn data, see below

Each result comes back as its own item, so you can map fields straight into the next node.

## LinkedIn

Five operations for public LinkedIn data, no cookies or login needed:

- **LinkedIn Profile**: paste a `linkedin.com/in/...` URL, get the person's name, headline, work history, education, and skills
- **LinkedIn Company**: a company page URL, with an optional employee list
- **LinkedIn Posts**: recent posts from a profile or company URL, with optional comments
- **LinkedIn Jobs**: job listings for keywords, with an optional location
- **LinkedIn People Search**: find people by keywords; turn on **Enrich** to get each person's full profile in the same call (1 credit per profile)

Example: to build a lead list, use **LinkedIn People Search** with keywords like "marketing director fintech" and Enrich on, then map `name`, `headline`, and `url` into a Google Sheet. A private or empty profile returns a note instead of data and is not charged.

## Credentials

You need a CrustAPI key. Get one free at [crustapi.com](https://crustapi.com) — 3,000 credits every month, no card. Paste it into the **CrustAPI API** credential; it's sent as the `x-api-key` header.

## Usage

Drop the node in, choose an operation, and set the query. For a lead-gen flow, use **Maps** with a Location and pull `website`, `phone`, and `reviewsCount` into columns. For reputation monitoring, use **Reviews** sorted by newest. For price tracking, use **Shopping**.

## Resources

- [CrustAPI docs](https://crustapi.com/docs)
- [n8n community nodes docs](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE)
