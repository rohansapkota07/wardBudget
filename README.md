# WardLedger — On-Chain Ward Budget Transparency Portal 🏛️

> Bringing radical transparency to Nepal's 753 local governments using the Solana blockchain.

Built for the **Superteam Nepal Solana Bounty** · Deployed on **Solana Devnet**

---

## 🔴 The Problem

Nepal's ward and municipality budgets are:
- **Opaque** — citizens have no real-time access to spending data
- **Unverifiable** — no public audit trail exists for project allocations
- **Corruption-prone** — manual record-keeping enables misreporting
- **Disconnected** — no standard interface for public accountability

## ✅ The Solution

WardLedger puts every **budget entry on-chain**. Ward officials post allocations as Solana transactions. Citizens — **no wallet needed** — can browse all spending, track project progress, and **flag suspicious entries** directly on-chain.

Immutable. Transparent. Public. Forever.

---

## 🎥 Demo Video

[▶ Watch the 3-minute demo on Loom/YouTube](#) ← *replace with your link*

---

## 🚀 Live App

[wardledger.vercel.app](#) ← *replace with your deployed link*

---

## ✨ Features

| Feature | Description |
|---|---|
| **Budget Dashboard** | Overview of all ward allocations, spending, and utilization rates |
| **Citizen View** | No-wallet public view — browse all entries, flag suspicious activity |
| **Admin Panel** | Ward officials post new entries and update project status on-chain |
| **On-Chain Flagging** | Citizens flag entries; 3+ flags auto-escalate to "Flagged" status |
| **Category Filtering** | Filter by Infrastructure, Health, Education, Sanitation, and more |
| **Solana Explorer Links** | Every entry links directly to its Devnet transaction |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Smart Contract** | Anchor (Rust) on Solana Devnet |
| **Frontend** | React + Vite |
| **Wallet** | Solana Wallet Adapter (Phantom) |
| **Styling** | Pure CSS (Space Mono + Fraunces fonts) |
| **Token (planned)** | SPL Token 2022 / Token Extensions for civic reward tokens |

---

## 🗂️ Project Structure

```
ward-budget-portal/
├── program/
│   └── src/
│       └── lib.rs          # Anchor smart contract (3 instructions)
└── src/
    ├── App.jsx             # Root component with navigation
    ├── App.css             # Full design system
    ├── main.jsx            # Solana wallet provider setup
    ├── mockData.js         # Sample data + helpers
    └── components/
        ├── Dashboard.jsx   # Overview stats + full entries table
        ├── AdminPanel.jsx  # Ward official posting interface
        └── CitizenView.jsx # Public transparency view + flagging
```

---

## ⚙️ On-Chain Architecture

The Anchor program exposes **3 instructions**:

```
add_budget_entry(entry_id, ward_id, title, description, category, amount_npr)
  └── Creates a BudgetEntry PDA seeded by entry_id

update_budget_entry(new_status, spent_npr)
  └── Only callable by the original posting authority

flag_entry()
  └── Any wallet can flag once; 3+ flags → auto "Flagged" status
      Uses CitizenFlagRecord PDA to prevent double-flagging
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- Rust + Solana CLI + Anchor CLI (for contract development)
- Phantom Wallet (browser extension)

### Frontend Setup

```bash
git clone https://github.com/YOUR_USERNAME/ward-budget-portal
cd ward-budget-portal
npm install
npm run dev
```

### Deploy the Anchor Program

```bash
cd program
anchor build
anchor deploy --provider.cluster devnet
```

Replace `declare_id!("YOUR_PROGRAM_ID_HERE")` in `lib.rs` with your deployed program ID.

---

## 🗺️ Roadmap

- [x] MVP frontend with mock data
- [x] Anchor program with add/update/flag instructions
- [ ] Wire frontend to live Anchor program
- [ ] SPL Token 2022 civic reward token for active citizens
- [ ] Ward registration & admin verification system
- [ ] IPFS/Arweave attachment support for project receipts
- [ ] Mobile-responsive PWA
- [ ] All 753 Nepal wards supported

---

## 💡 Business Case & Impact

Nepal has **753 local governments** receiving billions in federal grants annually. A nationwide deployment of WardLedger would:
- Enable real-time public auditing by civil society and media
- Create a precedent for blockchain-based governance in South Asia
- Integrate with existing Nepal government portals (e-governance.gov.np)
- Potentially attract World Bank / UN-Habitat civic-tech funding

---

## 👥 Team

Built by [Your Name] · [Team member 2] · [Team member 3]

Kathmandu, Nepal · February 2025

---

## 📄 License

MIT — freely usable by any Nepal ward office or civic tech organization.
