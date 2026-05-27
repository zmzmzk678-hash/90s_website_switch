# AI Retro Web Reconstruct System

An automated AI-powered agent architecture that crawls modern web interfaces, analyzes layout density profiles using DeepSeek Reasoner models, and converts the structural nodes into 1990s vintage web layouts (GeoCities, Windows 98 desktop app, CRT terminal grids, Vaporwave aesthetics) via DeepSeek Chat pipelines.

## System Pipeline Architecture

1. **URL Targeting & Processing**: User specifies target website URL and structural retro aesthetic themes via the Next.js Control Panel UI dashboard.
2. **Puppeteer Scraping Layer**: Headless Chrome layer automatically navigates SPAs, executes smooth auto-scrolling arrays to fulfill lazy load components, captures a raw full-page snapshot base64 URI, and bundles complete DOM subtree node representations.
3. **DeepSeek Reasoner Model Routing (`deepseek-reasoner`)**: Deeply parses the minified structural text DOM schemas, determines layout logical boundaries, sections, and structural component classes. Returns an optimized structured layout parameters JSON object.
4. **DeepSeek Chat Model Generation Layer (`deepseek-chat`)**: Translates structural patterns into classic legacy markup components: tables, marquee lines, blink modules, inline system fonts (Comic Sans, Courier), background GIFs, borders, and vintage custom themes.
5. **Security Matrix & Filtering**: Automatically processes output artifacts via `sanitize-html` layers, strip-clears unrecognized runtime cross-origin script nodes, and locks down execution boundaries with specific sandbox frame restrictions.

## Tech Stack Infrastructure

- **Frontend Core Application**: Next.js 15 (App Router Architecture), React 19, TypeScript, TailwindCSS
- **Backend Infrastructure Engines**: Node.js, Puppeteer Engine, DeepSeek Agent Interface Services
- **AI Models Integration**: `deepseek-reasoner` (Layout Deep Reasoning Engine) + `deepseek-chat` (High Fidelity Retro Code Generation Suite)

---

## Configuration & Environment Variables

Initialize your environment variables configuration before starting up the container clusters or manual local dev processes. Duplicate `.env.example` file and create `.env` file containing your valid DeepSeek key:

```env
DEEPSEEK_API_KEY=sb-xxxxxxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_API_BASE_URL=[https://api.deepseek.com/v1](https://api.deepseek.com/v1)
PORT=3000