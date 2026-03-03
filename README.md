# WardLedger — On-Chain Ward Budget Transparency Portal

Built for the Superteam Nepal Solana Bounty · Deployed on Solana Devnet

## The Problem

Nepal's ward and municipality budgets are opaque, unverifiable, and disconnected from citizens. We are from Banepa Municipality, Kavrepalanchok. We saw this problem firsthand and built WardLedger for our own town — Ward 1 through Ward 14.

## The Solution

WardLedger puts every budget entry on-chain. Ward officials post allocations as Solana transactions. Citizens — no wallet needed — can browse all spending, track project progress, flag suspicious entries, and vote on budget priorities.

**Immutable. Transparent. Public. Forever.**

## Demo Video

▶ [Watch the 3-minute demo](#) ← replace with your Loom/YouTube link

## Live App

https://wardbudgetnp.vercel.app

## On-Chain Program

- Program ID: `3VPYrrEJbdGsDQFMqYvJGLst5pnyL8xpyrbYbZQTYfBM`
- Network: Solana Devnet
- Explorer: https://explorer.solana.com/address/3VPYrrEJbdGsDQFMqYvJGLst5pnyL8xpyrbYbZQTYfBM?cluster=devnet

## Features

- **Budget Dashboard** — All ward allocations, spending, and utilization rates
- **Citizen View** — No-wallet public view, flag suspicious activity
- **Admin Panel** — Ward officials post entries and update status on-chain
- **On-Chain Flagging** — 3+ flags auto-escalate to Flagged status
- **On-Chain Voting** — Support/Oppose votes, one per wallet, enforced on-chain
- **Real Data** — Banepa Municipality FY 2082/083 budget figures

## Tech Stack

- Smart Contract: Anchor (Rust) on Solana Devnet
- Frontend: React + Vite + Solana Wallet Adapter
- Deployment: Vercel

## Getting Started
```bash
git clone https://github.com/rohansapkota07/wardBudget
cd wardBudget
npm install
npm run dev
```

## Roadmap

- [x] Anchor program with add/update/flag/vote instructions
- [x] Frontend wired to live Solana Devnet
- [x] Real Banepa Municipality budget data (FY 2082/083)
- [ ] SPL Token 2022 civic reward token for active citizens
- [ ] Ward admin registration and verification system
- [ ] All 753 Nepal wards supported

## Business Case

Nepal has 753 local governments receiving billions in federal grants annually. We started with Banepa (Total Budget: रु. १ अर्ब ६३ करोड ६५ लाख — FY 2082/083). The architecture supports any municipality.

## Team

Built by Rohan Sapkota — Banepa, Kavrepalanchok, Nepal · March 2026