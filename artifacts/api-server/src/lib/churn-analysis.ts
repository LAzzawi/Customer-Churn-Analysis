import { rawDataset, CustomerRecord } from "./churn-data.js";
import { trainLogisticRegression, standardize, evaluateModel, TrainingSample } from "./logistic-regression.js";

function encodeRecord(r: CustomerRecord): number[] {
  return [
    r.seniorCitizen,
    r.tenure / 72,
    r.monthlyCharges / 120,
    r.totalCharges / 9000,
    r.contract === "Month-to-month" ? 1 : 0,
    r.contract === "One year" ? 1 : 0,
    r.internetService === "Fiber optic" ? 1 : 0,
    r.internetService === "DSL" ? 1 : 0,
    r.paymentMethod === "Electronic check" ? 1 : 0,
    r.onlineSecurity === "Yes" ? 1 : 0,
    r.techSupport === "Yes" ? 1 : 0,
    r.paperlessBilling === "Yes" ? 1 : 0,
    r.partner === "Yes" ? 1 : 0,
    r.dependents === "Yes" ? 1 : 0,
    r.multipleLines === "Yes" ? 1 : 0,
  ];
}

const FEATURE_NAMES = [
  "Senior Citizen",
  "Tenure (normalized)",
  "Monthly Charges (normalized)",
  "Total Charges (normalized)",
  "Contract: Month-to-month",
  "Contract: One Year",
  "Internet: Fiber Optic",
  "Internet: DSL",
  "Payment: Electronic Check",
  "Online Security",
  "Tech Support",
  "Paperless Billing",
  "Has Partner",
  "Has Dependents",
  "Multiple Lines",
];

export interface AnalysisResult {
  weights: number[];
  featureNames: string[];
  metrics: ReturnType<typeof evaluateModel>;
  trainSize: number;
  testSize: number;
}

let cached: AnalysisResult | null = null;

export function getAnalysis(): AnalysisResult {
  if (cached) return cached;

  const allFeatures = rawDataset.map(encodeRecord);
  const { standardized, means, stds } = standardize(allFeatures);
  void means; void stds;

  const samples: TrainingSample[] = rawDataset.map((r, i) => ({
    features: standardized[i],
    label: r.churn,
  }));

  const splitIdx = Math.floor(samples.length * 0.8);
  const trainSamples = samples.slice(0, splitIdx);
  const testSamples = samples.slice(splitIdx);

  const weights = trainLogisticRegression(trainSamples, 0.3, 2000);
  const metrics = evaluateModel(weights, testSamples);

  cached = {
    weights,
    featureNames: FEATURE_NAMES,
    metrics,
    trainSize: trainSamples.length,
    testSize: testSamples.length,
  };
  return cached;
}

export function getChurnOverview() {
  const data = rawDataset;
  const total = data.length;
  const churned = data.filter((r) => r.churn === 1).length;
  const retained = total - churned;
  const churnRate = churned / total;
  const avgTenure = data.reduce((s, r) => s + r.tenure, 0) / total;
  const avgMonthly = data.reduce((s, r) => s + r.monthlyCharges, 0) / total;
  const avgTotal = data.reduce((s, r) => s + r.totalCharges, 0) / total;
  const seniors = data.filter((r) => r.seniorCitizen === 1);
  const nonSeniors = data.filter((r) => r.seniorCitizen === 0);
  const seniorChurnRate = seniors.length > 0 ? seniors.filter((r) => r.churn === 1).length / seniors.length : 0;
  const nonSeniorChurnRate = nonSeniors.length > 0 ? nonSeniors.filter((r) => r.churn === 1).length / nonSeniors.length : 0;

  return {
    totalCustomers: total,
    churnedCount: churned,
    retainedCount: retained,
    churnRate: Math.round(churnRate * 10000) / 10000,
    avgTenureMonths: Math.round(avgTenure * 10) / 10,
    avgMonthlyCharges: Math.round(avgMonthly * 100) / 100,
    avgTotalCharges: Math.round(avgTotal * 100) / 100,
    seniorCitizenChurnRate: Math.round(seniorChurnRate * 10000) / 10000,
    nonSeniorChurnRate: Math.round(nonSeniorChurnRate * 10000) / 10000,
  };
}

function segmentChurn(data: CustomerRecord[], keyFn: (r: CustomerRecord) => string) {
  const groups: Record<string, { churned: number; total: number }> = {};
  for (const r of data) {
    const key = keyFn(r);
    if (!groups[key]) groups[key] = { churned: 0, total: 0 };
    groups[key].total++;
    if (r.churn === 1) groups[key].churned++;
  }
  return Object.entries(groups).map(([segment, v]) => ({
    segment,
    churned: v.churned,
    retained: v.total - v.churned,
    total: v.total,
    churnRate: Math.round((v.churned / v.total) * 10000) / 10000,
  }));
}

function getTenureGroup(tenure: number): string {
  if (tenure <= 12) return "0-12 months";
  if (tenure <= 24) return "13-24 months";
  if (tenure <= 48) return "25-48 months";
  return "49-72 months";
}

export function getChurnDistribution() {
  const data = rawDataset;
  return {
    byContract: segmentChurn(data, (r) => r.contract),
    byInternetService: segmentChurn(data, (r) => r.internetService),
    byPaymentMethod: segmentChurn(data, (r) => r.paymentMethod),
    byTenureGroup: segmentChurn(data, (r) => getTenureGroup(r.tenure)),
    bySeniorCitizen: segmentChurn(data, (r) => (r.seniorCitizen === 1 ? "Senior" : "Non-Senior")),
    byTechSupport: segmentChurn(data, (r) =>
      r.techSupport === "No internet service" ? "No Internet" : r.techSupport === "Yes" ? "Has Tech Support" : "No Tech Support"
    ),
  };
}

export function getChurnFeatures() {
  const data = rawDataset;
  const categoricalFeatures: Array<{ feature: string; keyFn: (r: CustomerRecord) => string }> = [
    { feature: "Contract Type", keyFn: (r) => r.contract },
    { feature: "Internet Service", keyFn: (r) => r.internetService },
    { feature: "Payment Method", keyFn: (r) => r.paymentMethod },
    { feature: "Tech Support", keyFn: (r) => r.techSupport === "No internet service" ? "No Internet" : r.techSupport },
    { feature: "Online Security", keyFn: (r) => r.onlineSecurity === "No internet service" ? "No Internet" : r.onlineSecurity },
    { feature: "Paperless Billing", keyFn: (r) => r.paperlessBilling },
    { feature: "Senior Citizen", keyFn: (r) => r.seniorCitizen === 1 ? "Yes" : "No" },
    { feature: "Partner", keyFn: (r) => r.partner },
    { feature: "Dependents", keyFn: (r) => r.dependents },
  ];

  const results: Array<{ feature: string; value: string; churnRate: number; count: number }> = [];
  for (const { feature, keyFn } of categoricalFeatures) {
    const segs = segmentChurn(data, keyFn);
    for (const seg of segs) {
      results.push({ feature, value: seg.segment, churnRate: seg.churnRate, count: seg.total });
    }
  }
  return results;
}

export function getModelResults() {
  const analysis = getAnalysis();
  const { metrics, trainSize, testSize } = analysis;
  return {
    accuracy: Math.round(metrics.accuracy * 10000) / 10000,
    precision: Math.round(metrics.precision * 10000) / 10000,
    recall: Math.round(metrics.recall * 10000) / 10000,
    f1Score: Math.round(metrics.f1Score * 10000) / 10000,
    auc: Math.round(metrics.auc * 10000) / 10000,
    confusionMatrix: {
      truePositive: metrics.truePositive,
      trueNegative: metrics.trueNegative,
      falsePositive: metrics.falsePositive,
      falseNegative: metrics.falseNegative,
    },
    trainSize,
    testSize,
  };
}

export function getFeatureImportance() {
  const analysis = getAnalysis();
  const { weights, featureNames } = analysis;
  return featureNames
    .map((name, i) => ({
      feature: name,
      coefficient: Math.round(weights[i + 1] * 10000) / 10000,
      absCoefficient: Math.round(Math.abs(weights[i + 1]) * 10000) / 10000,
      direction: weights[i + 1] > 0 ? "Increases Churn" : "Decreases Churn",
    }))
    .sort((a, b) => b.absCoefficient - a.absCoefficient);
}

export function getRecommendations() {
  return [
    {
      priority: "High",
      title: "Target Month-to-Month Contract Customers",
      description: "Month-to-month contract customers churn at significantly higher rates. Offer incentives to upgrade to annual or two-year contracts.",
      impact: "Estimated 20-30% reduction in churn for targeted segment",
      action: "Launch a contract upgrade campaign with a 2-month discount for customers switching to annual plans."
    },
    {
      priority: "High",
      title: "Intervene with Fiber Optic Customers Early",
      description: "Fiber optic internet customers show elevated churn rates, likely due to price sensitivity or service quality expectations.",
      impact: "Fiber optic segment represents the highest monthly charges and churn risk",
      action: "Conduct proactive satisfaction surveys at 3, 6, and 12-month tenure marks and offer loyalty discounts."
    },
    {
      priority: "High",
      title: "Address Electronic Check Payment Method",
      description: "Customers paying via electronic check churn more than those using automatic bank transfers or credit cards.",
      impact: "Switching customers to automatic payment could reduce churn by up to 15%",
      action: "Incentivize enrollment in auto-pay with a small monthly bill credit."
    },
    {
      priority: "Medium",
      title: "Bundle Tech Support and Online Security",
      description: "Customers without tech support and online security have higher churn rates. Bundled services increase switching costs.",
      impact: "Customers with both services show significantly lower churn",
      action: "Offer a 3-month free trial of security and tech support add-ons to at-risk customers."
    },
    {
      priority: "Medium",
      title: "Prioritize Retention of Senior Citizens",
      description: "Senior citizen customers churn at a higher rate and may benefit from specialized support and simplified plans.",
      impact: "Senior segment is a growing demographic with specific needs",
      action: "Create a dedicated senior customer service line and offer simplified, discounted plan bundles."
    },
    {
      priority: "Low",
      title: "Paperless Billing Churn Monitoring",
      description: "Customers with paperless billing show slightly higher churn. Monitor whether bill shock from unexpected charges is a driver.",
      impact: "Could improve satisfaction for digitally-engaged customers",
      action: "Send proactive usage alerts and bill previews 5 days before billing date for paperless customers."
    },
  ];
}
