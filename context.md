# DateAuction – Context

> **Goal**
> Build an Expo‑powered mobile app (React Native + TypeScript) where verified hosts list dates and paying users bid or buy at a fixed price. Access is gated by Bronze / Silver / Gold subscriptions.

## Architecture

### Front‑end

* **Expo (React Native, TypeScript)** – rapid cross‑platform build tools.
* **Expo Router** – file‑based navigation and deep linking.
* **React Native Paper** – Material Design component library.

### Backend & Auth

* **Supabase (PostgreSQL)** with Row‑Level Security.
* **Supabase Auth** – email/password + Google, Apple, Facebook logins.
* **Realtime bids** via Supabase Realtime channels.

### Payments

* **RevenueCat** SDK (Expo In‑App‑Purchases) for Apple/Google subscriptions.

### DevOps

* **Expo Go** for development preview.
* **EAS Build & Submit** for store‑ready binaries.
* **GitHub Actions** CI → EAS pipeline.
* **Sentry** for crash/error monitoring.

---

## Data Model

| Table           | Purpose              | Key Columns                                                                                                   |
| --------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `users`         | Auth accounts & tier | `id`, `email`, `tier`, `created_at`                                                                           |
| `profiles`      | Public user info     | `user_id`, `age`, `location`, `bio`                                                                           |
| `hosts`         | Verified date hosts  | `id`, `display_name`, `tier_min`, `bio`, `photos[]`                                                           |
| `dates`         | Date listings        | `id`, `host_id`, `title`, `price_type` (`fixed`/`hourly`), `fixed_price`, `hourly_rate`, `start_at`, `end_at` |
| `bids`          | Auction bids         | `id`, `date_id`, `user_id`, `amount`, `created_at`                                                            |
| `subscriptions` | Active app subs      | `id`, `user_id`, `tier`, `status`, `renewal_date`                                                             |

> **RLS**: `user_id = auth.uid()` on every table for secure client‑side queries.

---

## Key Flows

1. **On‑boarding**

   1. Sign‑up (email/social)
   2. Budget & preference quiz → recommend tier
   3. Paywall – choose Bronze/Silver/Gold (RevenueCat checkout)
   4. Profile completion (photos, bio)
2. **Date lifecycle**

   1. Host creates listing
   2. Users place bids or "Buy Now"
   3. Winning user notified (push)
   4. Post‑date escrow release (TBD)

---

## Subscription Tiers

| Tier       | AUD / month | Benefits                                                   |
| ---------- | ----------- | ---------------------------------------------------------- |
| **Bronze** | 9.99        | Basic listings · standard bid limits                       |
| **Silver** | 19.99       | Mid‑tier listings · higher limits · priority notifications |
| **Gold**   | 49.99       | Premium listings · unlimited bids · featured placement     |

---

## Safety & Compliance

* ≥18 age verification; host ID/selfie check.
* Report / block system & auto‑ban repeat offenders.
* Aligns with **2024 Australian Online Dating Code of Conduct**.
* GDPR & **Australian Privacy Act** data handling.

---

## Non‑Functional Requirements

* 60 fps UI, image lazy‑loading.
* Offline cache critical queries via `AsyncStorage`.
* Testing: **Jest** + **React Native Testing Library**; E2E ⇒ **Detox**.
* Monitoring: **Sentry**, Supabase logs.

---

## Open Questions

* Final pricing confirmation?
* Escrow / payment release logic for hourly dates?
* Cancellation & refund policy?
* Moderation tooling & SLA?

---

## Glossary

| Term            | Meaning                                   |
| --------------- | ----------------------------------------- |
| **Host**        | Verified user offering a date             |
| **User**        | Bidder / date buyer                       |
| **Tier**        | Subscription level (Bronze, Silver, Gold) |
| **Fixed‑Price** | Buy‑now cost for the full date            |
| **Hourly**      | Cost calculated per hour of the date      |
