# Pricing & Marketing Audit — Arden Project OS

**Date:** 2026-06-13  
**Canonical manifest:** `shared/pricing-manifest.json` (marketing repo; sync to app repo)

---

## 1. Plan IDs and display names

| Plan ID | Customer-facing name | Internal long name (Billing subtitle) |
|---|---|---|
| `free` | Free | Free |
| `starter` | **Starter** | Foundation |
| `professional` | **Professional** | Field |
| `business` | **Business** | Portfolio |

**Standardization:** Remove `Pro` from all customer-facing pricing. Use **Professional** everywhere.

---

## 2. Monthly and annual prices (configured)

Source: `shared/pricing-manifest.json` / `src/lib/planMarketing.ts` (app). Stripe resolves live charge amounts via lookup keys.

| Plan | Monthly | Annual effective /mo | Annual total billed |
|---|---:|---:|---:|
| Starter | $49 | $41 | $490 |
| Professional | $129 | $109 | $1,308 |
| Business | $249 | $209 | $2,508 |

**Annual savings (calculated, not rounded marketing copy):**

| Plan | Savings vs 12× monthly | Percent |
|---|---:|---:|
| Starter | $98/yr | 17% |
| Professional | $240/yr | 16% |
| Business | $480/yr | 16% |

Do **not** show a blanket “Save 15%” badge — savings vary by plan.

**Stripe lookup keys:**

| Plan | Monthly | Annual |
|---|---|---|
| starter | `arden_starter_monthly` | `arden_starter_annual` |
| professional | `arden_professional_monthly` | `arden_professional_annual` |
| business | `arden_business_monthly` | `arden_business_annual` |

---

## 3. Trial behavior

| Item | Finding |
|---|---|
| App code constants | **No** `hasTrial` / `trialDays` / `trial_period_days` in checkout |
| Checkout session | `create-checkout-session` sets subscription metadata only — trial must come from Stripe Dashboard if offered |
| Entitlements | `trialing` status unlocks paid plan features |
| Billing UI | Uses **Choose {Plan}** — not “Start Free Trial” |
| Marketing (before fix) | Incorrectly claimed free trial on all CTAs |

**Manifest setting:** `"hasTrial": false` — marketing must not promise a trial until Stripe checkout explicitly configures one.

---

## 4. Active project limits

| Plan | Limit |
|---|---|
| free | 1 |
| starter | 3 |
| professional | 10 |
| business | Unlimited |

---

## 5. Included field seats

| Plan | Included | Max purchasable cap |
|---|---:|---:|
| free | 0 | 0 |
| starter | 1 | 1 |
| professional | 5 | 25 |
| business | 15 | Unlimited |

**Prior marketing error:** Professional listed **3** seats; Business listed **10** seats.

---

## 6. Feature gates by plan

### Starter (marketable)
`quick_estimates`, `conceptual_estimates`, `calculators`, `resources`, `proposals`, `global_ask_ai`

### Professional adds (marketable subset)
`activity_based_estimating`, `proposal_public_links`, `employee_portal`, `rfis`, `fars`, `qc`, `document_builder`, `client_portal`, `change_orders`, `logic_network`, `cpm`, `level_three_gantt`, `arden_calc_in_estimator`

### Business adds (marketable subset)
`level_three_gantt_export`, `accounting_exports`, `financial_dashboard`, `ai_concrete_chat`, `ai_scope_summary`, `ai_labor_crew_review`, `ai_batch_plant_tools`, `contract_builder`, `global_planner_hub`

### Entitled but **not publicly marketed** (not production-ready for broad launch)
| Feature key | Minimum plan | Reason to withhold from public pricing |
|---|---|---|
| `design_builder` | Professional | Gated but not release-ready for paying customers |
| `model_3d_takeoff` | Professional | Beta / limited reliability |
| `model_3d_extraction` | Business | Advanced BIM; not broad-launch ready |

---

## 7. Usage / credit limits by plan

Enforced via `PLAN_USAGE_LIMITS` (client + server):

| Plan | AI requests/mo | Weather | Geocode | Travel | Place search | Email send |
|---|---:|---:|---:|---:|---:|---:|
| free | 0 | 25 | 10 | 10 | 10 | 10 |
| starter | 50 | 250 | 100 | 100 | 100 | 100 |
| professional | 250 | 1,000 | 500 | 500 | 500 | 500 |
| business | 1,000 | 5,000 | 2,000 | 2,000 | 2,000 | 2,000 |

**Note:** `PLAN_LIMITS.ai_requests_monthly` for Business is 500 in entitlements vs 1,000 in usage metering — metering uses usage limits.

---

## 8. Unsupported / mismatched marketing claims (fixed)

| Claim (old marketing) | Issue |
|---|---|
| **Pro** plan name | Wrong — must be **Professional** |
| “3 field seats” on Professional | Wrong — **5** included |
| “10 field seats” on Business | Wrong — **15** included |
| “PDF exports” as Starter highlight | Unverified as Starter entitlement |
| “Advanced reporting” | Vague / unsupported |
| “Contracts” / “Priority support” | Not verified plan differentiators |
| “Getting organized” / “full project control” | Beginner copy — removed |
| “Start Free Trial” everywhere | No trial configured in checkout code |
| Homepage pricing with no dollar amounts | Diverged from `/pricing` and Billing |
| Separate feature lists in `PricingPreview` | Duplicated, inaccurate catalog |

---

## 9. Features not marketable yet

- **Design Builder** (`design_builder`)
- **3D Takeoff** (`model_3d_takeoff`, `model_3d_extraction`)

Keep out of public pricing until entitlement, stability, documented limits, and support readiness are confirmed.

---

## Implementation summary

| Layer | Role |
|---|---|
| `shared/pricing-manifest.json` | Versioned public catalog (prices, limits, marketable features, trial flag) |
| `src/lib/publicPlanCatalog.ts` | Marketing display helpers, CTAs, JSON-LD offers |
| App `src/lib/planMarketing.ts` | Billing cards — must consume same manifest |
| `src/lib/entitlements.ts` | Capability truth for enforcement |
| `src/lib/stripeConfig.ts` | Stripe lookup keys |

**CTA rules (marketing):** `Choose Starter` / `Choose Professional` / `Choose Business` → `app.ardenprojectos.com/settings/billing?upgrade={planId}`

**CTA rules (Billing, logged in):** Current plan / Upgrade / Downgrade via `PricingPlansCard.tsx`

---

## Sync checklist

When changing prices or plan copy:

1. Update `shared/pricing-manifest.json` in **both** repos
2. Verify Stripe lookup key prices match manifest
3. Run `npm test` (marketing + app plan catalog tests)
4. Run `npm run verify:seo` on marketing site
