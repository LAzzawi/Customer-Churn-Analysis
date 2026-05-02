# Customer Churn Analysis — Telecom

A full-stack data science project that analyzes customer churn in the telecom industry using exploratory data analysis, feature engineering, and a logistic regression model built from scratch. The project delivers interactive visualizations, model evaluation metrics, and actionable business recommendations through a modern web interface.

---

## Overview

Customer churn is one of the most costly challenges facing telecom companies. This project combines classical machine learning with a production-grade web application to make churn insights accessible to analysts and decision-makers alike.

The analysis pipeline covers the complete data science workflow:

- Data loading and cleaning from the IBM Telco Customer Churn dataset
- Feature engineering and standardization
- Exploratory data analysis with segment-level churn rates
- Logistic regression trained via gradient descent (no external ML library)
- Model evaluation with accuracy, precision, recall, F1 score, AUC, and confusion matrix
- Feature importance derived from model coefficients
- Actionable business recommendations tied to analytical findings

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Charts | Recharts |
| UI Components | shadcn/ui + Tailwind CSS |
| Data Fetching | TanStack React Query |
| Backend | Express 5 + TypeScript + Node.js |
| API Contract | OpenAPI 3.1 (contract-first) |
| Codegen | Orval (React Query hooks + Zod schemas) |
| ML | Custom logistic regression (gradient descent, TypeScript) |
| Monorepo | pnpm workspaces |

---

## Project Structure

```
.
├── artifacts/
│   ├── api-server/            # Express API server
│   │   └── src/
│   │       ├── lib/
│   │       │   ├── churn-data.ts          # Embedded Telco dataset
│   │       │   ├── churn-analysis.ts      # EDA, segmentation, recommendations
│   │       │   └── logistic-regression.ts # Custom ML implementation
│   │       └── routes/
│   │           └── churn.ts               # API route handlers
│   └── churn-analysis/        # React frontend (analysis report)
│       └── src/
│           └── pages/
│               └── churn-report.tsx       # Full interactive report
├── lib/
│   ├── api-spec/              # OpenAPI spec (source of truth)
│   ├── api-client-react/      # Generated React Query hooks
│   └── api-zod/               # Generated Zod validation schemas
└── pnpm-workspace.yaml
```

---

## Machine Learning Pipeline

### Data Preprocessing

- 15 engineered features including tenure normalization, one-hot encoding for contract type, internet service, and payment method
- Feature standardization using z-score normalization (zero mean, unit variance)
- 80/20 train-test split

### Model: Logistic Regression

Implemented entirely from scratch in TypeScript:

- **Sigmoid activation** for probability estimation
- **Batch gradient descent** with configurable learning rate and epochs
- **AUC computation** via rank-based trapezoid method
- No dependency on external ML frameworks

```
P(churn) = sigmoid(w₀ + w₁x₁ + w₂x₂ + ... + wₙxₙ)
```

### Evaluation Metrics

| Metric | Description |
|---|---|
| Accuracy | Overall correct predictions |
| Precision | Of predicted churners, how many actually churned |
| Recall | Of actual churners, how many were correctly identified |
| F1 Score | Harmonic mean of precision and recall |
| AUC | Area under the ROC curve |

---

## API Endpoints

All endpoints are served under `/api`:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/churn/overview` | Overall stats — churn rate, avg tenure, avg charges |
| GET | `/churn/distribution` | Churn breakdown by contract, internet, payment, tenure group |
| GET | `/churn/features` | Churn rate by feature value (EDA) |
| GET | `/churn/model` | Logistic regression evaluation metrics + confusion matrix |
| GET | `/churn/feature-importance` | Ranked model coefficients with direction |
| GET | `/churn/recommendations` | Priority-coded business recommendations |

---

## Report Sections

The interactive web report covers:

1. **Executive Summary** — Key findings driven by real model outputs
2. **Churn Overview** — KPI stats + retained vs. churned breakdown
3. **Churn Distribution** — Tabbed analysis by contract, internet service, and payment method
4. **Customer Segments** — Tenure group risk and senior citizen demographics
5. **Feature Analysis** — Horizontal bar chart of churn rate by feature value
6. **Logistic Regression Model** — Metrics grid + visual confusion matrix
7. **Feature Importance** — Coefficient chart colored by churn direction
8. **Business Recommendations** — Priority-coded actions derived from the model

---

## Key Findings

- **Month-to-month contracts** have a significantly higher churn rate than annual or two-year contracts
- **Fiber optic internet** customers churn at a higher rate — likely driven by price sensitivity
- **Electronic check** payers churn more than auto-pay customers
- **Short-tenure customers** (0–12 months) are the highest-risk segment
- Customers **without tech support or online security** are more likely to leave
- **Senior citizens** churn at a disproportionately higher rate

---

## Business Recommendations

| Priority | Action |
|---|---|
| High | Offer discounts to convert month-to-month customers to annual contracts |
| High | Proactive retention outreach for fiber optic customers at 3, 6, and 12-month marks |
| High | Incentivize auto-pay enrollment with a monthly bill credit |
| Medium | Bundle tech support and online security as a free trial for at-risk customers |
| Medium | Create a dedicated senior plan with simplified pricing and dedicated support |
| Low | Send bill previews 5 days before billing for paperless billing customers |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Install

```bash
pnpm install
```

### Run (Development)

```bash
# Start the API server
pnpm --filter @workspace/api-server run dev

# Start the frontend
pnpm --filter @workspace/churn-analysis run dev
```

### Regenerate API client (after spec changes)

```bash
pnpm --filter @workspace/api-spec run codegen
```

### Typecheck

```bash
pnpm run typecheck
```

---

## Dataset

This project uses the **IBM Telco Customer Churn** dataset, a widely referenced benchmark dataset in the customer retention literature. It contains customer demographics, service subscriptions, contract details, and churn labels.

Features include:

- **Demographics**: Gender, senior citizen status, partner, dependents
- **Services**: Phone, internet (DSL / Fiber optic), online security, tech support, streaming
- **Account**: Contract type, billing method, payment method, monthly and total charges, tenure

---

## Author

**Laith Azzawi**  
Data Scientist | Software Engineer  

[GitHub](https://github.com/LAzzawi)
