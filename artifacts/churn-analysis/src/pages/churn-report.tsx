import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import {
  useGetChurnOverview,
  getGetChurnOverviewQueryKey,
  useGetChurnDistribution,
  useGetChurnFeatures,
  useGetChurnModel,
  useGetFeatureImportance,
  useGetChurnRecommendations,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ScatterChart, Scatter, ZAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Sun, Moon, Download, Printer, AlertTriangle, ChevronRight, Activity, TrendingUp, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CHART_COLORS = {
  blue: "#0079F2",
  purple: "#795EFF",
  green: "#009118",
  red: "#A60808",
  pink: "#ec4899",
};

const CHART_COLOR_LIST = [
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.green,
  CHART_COLORS.red,
  CHART_COLORS.pink,
];

const DATA_SOURCES: string[] = ["IBM Telco Dataset"];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(value);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1 }).format(value);
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "6px",
        padding: "10px 14px",
        border: "1px solid #e0e0e0",
        color: "#1a1a1a",
        fontSize: "13px",
      }}
    >
      <div style={{ marginBottom: "6px", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }}>
        {payload.length === 1 && payload[0].color && payload[0].color !== "#ffffff" && (
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: payload[0].color, flexShrink: 0 }} />
        )}
        {label}
      </div>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
          {payload.length > 1 && entry.color && entry.color !== "#ffffff" && (
            <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: entry.color, flexShrink: 0 }} />
          )}
          <span style={{ color: "#444" }}>{entry.name}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>
            {typeof entry.value === "number" ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : entry.value}
            {entry.name && entry.name.toLowerCase().includes('rate') && '%'}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }: any) {
  if (!payload || payload.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 16px", fontSize: "13px" }}>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: entry.color, flexShrink: 0 }} />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ChurnReport() {
  const queryClient = useQueryClient();
  const [isDark, setIsDark] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const overviewQuery = useGetChurnOverview({ query: { queryKey: getGetChurnOverviewQueryKey() } });
  const distributionQuery = useGetChurnDistribution();
  const featuresQuery = useGetChurnFeatures();
  const modelQuery = useGetChurnModel();
  const importanceQuery = useGetFeatureImportance();
  const recommendationsQuery = useGetChurnRecommendations();

  const loading = overviewQuery.isLoading || overviewQuery.isFetching || 
                  distributionQuery.isLoading || distributionQuery.isFetching ||
                  featuresQuery.isLoading || featuresQuery.isFetching ||
                  modelQuery.isLoading || modelQuery.isFetching ||
                  importanceQuery.isLoading || importanceQuery.isFetching ||
                  recommendationsQuery.isLoading || recommendationsQuery.isFetching;

  useEffect(() => {
    if (loading) {
      setIsSpinning(true);
    } else {
      const t = setTimeout(() => setIsSpinning(false), 600);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleRefresh = async () => {
    await queryClient.refetchQueries();
  };

  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";
  const tickColor = isDark ? "#98999C" : "#71717a";

  const lastRefreshed = overviewQuery.dataUpdatedAt
    ? (() => {
        const d = new Date(overviewQuery.dataUpdatedAt);
        const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
        const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return `${time} on ${date}`;
      })()
    : null;

  const overview = overviewQuery.data;
  const distribution = distributionQuery.data;
  const features = featuresQuery.data || [];
  const model = modelQuery.data;
  const importance = importanceQuery.data || [];
  const recommendations = recommendationsQuery.data || [];

  return (
    <div className="min-h-screen bg-background px-5 py-4 pt-[32px] pb-[32px] pl-[24px] pr-[24px]">
      <div className="max-w-[900px] mx-auto">
        
        {/* ── Header ── */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="pt-2">
            <h1 className="font-bold text-[32px] tracking-tight">Telecom Customer Churn Analysis</h1>
            <p className="text-muted-foreground mt-1.5 text-[14px]">Logistic Regression Analysis & Business Recommendations</p>
            {DATA_SOURCES.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[12px] text-muted-foreground shrink-0">
                  Data Sources:
                </span>
                {DATA_SOURCES.map((source) => (
                  <span
                    key={source}
                    className="text-[12px] font-bold rounded px-2 py-0.5 truncate print:!bg-[rgb(229,231,235)] print:!text-[rgb(75,85,99)]"
                    title={source}
                    style={{
                      maxWidth: "20ch",
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgb(229, 231, 235)",
                      color: isDark ? "#c8c9cc" : "rgb(75, 85, 99)",
                    }}
                  >
                    {source}
                  </span>
                ))}
              </div>
            )}
            {lastRefreshed && <p className="text-[12px] text-muted-foreground mt-3">Last refresh: {lastRefreshed}</p>}
          </div>
          <div className="flex items-center gap-3 pt-2 print:hidden">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1 px-2 h-[26px] rounded-[6px] text-[12px] font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2",
                color: isDark ? "#c8c9cc" : "#4b5563",
              }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => window.print()}
              disabled={loading}
              className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors disabled:opacity-50"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2",
                color: isDark ? "#c8c9cc" : "#4b5563",
              }}
              aria-label="Export as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDark((d) => !d)}
              className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2",
                color: isDark ? "#c8c9cc" : "#4b5563",
              }}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ── Executive Summary ── */}
        <Card className="mb-6 shadcn-card border-border bg-card">
          <CardHeader className="px-6 pt-6 pb-2">
            <CardTitle className="text-lg font-bold">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {loading || !overview || !model || !importance.length ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
              </div>
            ) : (
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>The overall customer churn rate is <strong>{formatPercent(overview.churnRate)}</strong> out of {overview.totalCustomers.toLocaleString()} total customers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Our logistic regression model predicts churn with <strong>{formatPercent(model.accuracy)} accuracy</strong> and an AUC of {model.auc.toFixed(2)}, providing a highly reliable basis for intervention.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>The most critical risk factor is <strong>{importance[0]?.feature.replace(/_/g, ' ')}</strong>, which heavily correlates with customers leaving the service.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Month-to-month contracts and fiber optic internet services show disproportionately high churn, highlighting immediate areas for retention campaigns.</span>
                </li>
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">

          {/* Section 1: Churn Overview */}
          <Card className="shadcn-card border-border">
            <CardHeader className="px-6 pt-6 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-bold">1. Churn Overview</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loading || !overview ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-32" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="w-full h-[280px]" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-2">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Total Customers</p>
                      <p className="text-2xl font-bold mt-1" style={{ color: CHART_COLORS.blue }}>{overview.totalCustomers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Global Churn Rate</p>
                      <p className="text-2xl font-bold mt-1" style={{ color: CHART_COLORS.red }}>{formatPercent(overview.churnRate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Avg Tenure</p>
                      <p className="text-2xl font-bold mt-1 text-foreground">{overview.avgTenureMonths.toFixed(1)} mo</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Avg Monthly Charge</p>
                      <p className="text-2xl font-bold mt-1 text-foreground">{formatCurrency(overview.avgMonthlyCharges)}</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={280} debounce={0}>
                    <BarChart data={[{ name: "Customers", Retained: overview.retainedCount, Churned: overview.churnedCount }]} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                      <Legend content={<CustomLegend />} />
                      <Bar dataKey="Retained" stackId="a" fill={CHART_COLORS.blue} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Churned" stackId="a" fill={CHART_COLORS.red} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2 text-sm text-foreground leading-relaxed">
                    <p>The company currently maintains a customer base of {overview.totalCustomers.toLocaleString()}, with a churn rate of <strong>{formatPercent(overview.churnRate)}</strong>.</p>
                    <p>While the majority of customers ({overview.retainedCount.toLocaleString()}) are retained, the loss of {overview.churnedCount.toLocaleString()} customers represents a significant negative impact on recurring revenue. The average tenure of {overview.avgTenureMonths.toFixed(1)} months indicates a reasonably established base, but highlights the need to secure early-stage relationships.</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Churn Distribution */}
          <Card className="shadcn-card border-border">
            <CardHeader className="px-6 pt-6 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-bold">2. Churn Distribution by Category</CardTitle>
              {!loading && distribution && (
                <CSVLink data={distribution.byContract} filename="churn-distribution.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }} aria-label="Export chart data as CSV">
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loading || !distribution ? <Skeleton className="w-full h-[320px]" /> : (
                <Tabs defaultValue="contract" className="w-full mt-2">
                  <TabsList className="mb-4">
                    <TabsTrigger value="contract">Contract Type</TabsTrigger>
                    <TabsTrigger value="internet">Internet Service</TabsTrigger>
                    <TabsTrigger value="payment">Payment Method</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="contract">
                    <ResponsiveContainer width="100%" height={280} debounce={0}>
                      <BarChart data={distribution.byContract}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis dataKey="segment" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                        <YAxis yAxisId="left" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                        <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                        <Legend content={<CustomLegend />} />
                        <Bar yAxisId="left" dataKey="total" name="Total Customers" fill={CHART_COLORS.blue} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[2, 2, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="churnRate" name="Churn Rate" stroke={CHART_COLORS.red} strokeWidth={2} dot={{ r: 4, fill: CHART_COLORS.red }} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>

                  <TabsContent value="internet">
                    <ResponsiveContainer width="100%" height={280} debounce={0}>
                      <BarChart data={distribution.byInternetService}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis dataKey="segment" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                        <YAxis yAxisId="left" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                        <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                        <Legend content={<CustomLegend />} />
                        <Bar yAxisId="left" dataKey="total" name="Total Customers" fill={CHART_COLORS.blue} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[2, 2, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="churnRate" name="Churn Rate" stroke={CHART_COLORS.red} strokeWidth={2} dot={{ r: 4, fill: CHART_COLORS.red }} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>

                  <TabsContent value="payment">
                    <ResponsiveContainer width="100%" height={280} debounce={0}>
                      <BarChart data={distribution.byPaymentMethod}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis dataKey="segment" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                        <YAxis yAxisId="left" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                        <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                        <Legend content={<CustomLegend />} />
                        <Bar yAxisId="left" dataKey="total" name="Total Customers" fill={CHART_COLORS.blue} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[2, 2, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="churnRate" name="Churn Rate" stroke={CHART_COLORS.red} strokeWidth={2} dot={{ r: 4, fill: CHART_COLORS.red }} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              )}
              {!loading && distribution && (
                <div className="mt-4 space-y-2 text-sm text-foreground leading-relaxed">
                  <p>Contract type is a massive differentiator: <strong>Month-to-month contracts</strong> face critically high churn rates compared to one or two-year commitments. Encouraging contract lock-in is a clear retention vector.</p>
                  <p>Additionally, users on Fiber Optic services and those paying via Electronic Check show heightened risk profiles. These segments require targeted service quality audits and potential payment method migration incentives.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Customer Segments */}
          <Card className="shadcn-card border-border">
            <CardHeader className="px-6 pt-6 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-bold">3. Tenure & Demographics</CardTitle>
              {!loading && distribution && (
                <CSVLink data={distribution.byTenureGroup} filename="tenure-demographics.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }} aria-label="Export chart data as CSV">
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loading || !distribution ? <Skeleton className="w-full h-[280px]" /> : (
                <ResponsiveContainer width="100%" height={280} debounce={0}>
                  <BarChart data={distribution.byTenureGroup}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="segment" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                    <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                    <Legend content={<CustomLegend />} />
                    <Bar yAxisId="left" dataKey="total" name="Base Size" fill={CHART_COLORS.blue} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[2, 2, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="churnRate" name="Churn Rate" stroke={CHART_COLORS.red} strokeWidth={2} dot={{ r: 4, fill: CHART_COLORS.red }} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {!loading && distribution && (
                <div className="mt-4 space-y-2 text-sm text-foreground leading-relaxed">
                  <p>The first year is the danger zone. Churn drops precipitously as tenure increases. Customers in the 0-12 month bracket are abandoning the platform at rates that dwarf any other tenure group.</p>
                  <p>Demographically, Senior Citizens have a notable churn variance. Furthermore, lack of Tech Support is strongly correlated with leaving, indicating that service friction in the early lifecycle is lethal to retention.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 4: Exploratory Feature Analysis */}
          <Card className="shadcn-card border-border">
            <CardHeader className="px-6 pt-6 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-bold">4. Top Driver Exploration</CardTitle>
              {!loading && features.length > 0 && (
                <CSVLink data={features} filename="feature-analysis.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }} aria-label="Export chart data as CSV">
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loading || !features.length ? <Skeleton className="w-full h-[320px]" /> : (
                <ResponsiveContainer width="100%" height={320} debounce={0}>
                  <BarChart data={features.slice(0, 10).sort((a,b) => b.churnRate - a.churnRate)} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                    <XAxis type="number" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                    <YAxis type="category" dataKey="value" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} />
                    <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                    <Bar dataKey="churnRate" name="Churn Rate" fill={CHART_COLORS.purple} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {!loading && features.length > 0 && (
                <div className="mt-4 space-y-2 text-sm text-foreground leading-relaxed">
                  <p>When isolating specific feature values, the highest raw churn rates appear across isolated sub-segments. This vertical view ranks the absolute worst-performing cohorts.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 5: Logistic Regression Model */}
          <Card className="shadcn-card border-border">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-lg font-bold">5. Model Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loading || !model ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    <div className="bg-muted/40 border p-3 rounded-md">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Accuracy</p>
                      <p className="text-xl font-bold mt-1 text-foreground">{formatPercent(model.accuracy)}</p>
                    </div>
                    <div className="bg-muted/40 border p-3 rounded-md">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Precision</p>
                      <p className="text-xl font-bold mt-1 text-foreground">{formatPercent(model.precision)}</p>
                    </div>
                    <div className="bg-muted/40 border p-3 rounded-md">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Recall</p>
                      <p className="text-xl font-bold mt-1 text-foreground">{formatPercent(model.recall)}</p>
                    </div>
                    <div className="bg-muted/40 border p-3 rounded-md">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">F1 Score</p>
                      <p className="text-xl font-bold mt-1 text-foreground">{model.f1Score.toFixed(3)}</p>
                    </div>
                    <div className="bg-muted/40 border p-3 rounded-md">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">AUC</p>
                      <p className="text-xl font-bold mt-1" style={{ color: CHART_COLORS.blue }}>{model.auc.toFixed(3)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-3">Confusion Matrix (Test Set: {model.testSize})</p>
                    <div className="grid grid-cols-2 gap-2 max-w-[400px]">
                      <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-md flex flex-col items-center justify-center text-center">
                        <p className="text-xs text-green-700 dark:text-green-400 mb-1">True Negative (Retained)</p>
                        <p className="text-xl font-bold text-green-700 dark:text-green-400">{model.confusionMatrix.trueNegative}</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-md flex flex-col items-center justify-center text-center">
                        <p className="text-xs text-red-700 dark:text-red-400 mb-1">False Positive (False Alarm)</p>
                        <p className="text-xl font-bold text-red-700 dark:text-red-400">{model.confusionMatrix.falsePositive}</p>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-md flex flex-col items-center justify-center text-center">
                        <p className="text-xs text-amber-700 dark:text-amber-400 mb-1">False Negative (Missed)</p>
                        <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{model.confusionMatrix.falseNegative}</p>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-md flex flex-col items-center justify-center text-center">
                        <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">True Positive (Churned)</p>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{model.confusionMatrix.truePositive}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-foreground leading-relaxed">
                    <p>The logistic regression model (trained on {model.trainSize} records) shows strong predictive power with an AUC of {model.auc.toFixed(2)}. The recall of {formatPercent(model.recall)} means we successfully identify a majority of churners before they leave.</p>
                    <p>The confusion matrix indicates {model.confusionMatrix.falsePositive} false alarms, which is an acceptable tradeoff to ensure we capture the {model.confusionMatrix.truePositive} true churn risks for proactive retention targeting.</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Section 6: Feature Importance */}
          <Card className="shadcn-card border-border">
            <CardHeader className="px-6 pt-6 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-bold">6. Predictive Feature Importance</CardTitle>
              {!loading && importance.length > 0 && (
                <CSVLink data={importance} filename="feature-coefficients.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }} aria-label="Export chart data as CSV">
                  <Download className="w-3.5 h-3.5" />
                </CSVLink>
              )}
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loading || !importance.length ? <Skeleton className="w-full h-[320px]" /> : (
                <ResponsiveContainer width="100%" height={360} debounce={0}>
                  <BarChart data={importance.slice(0, 12)} layout="vertical" margin={{ left: 120 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                    <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} tickFormatter={(val) => val.replace(/_/g, ' ')} />
                    <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                    <Bar dataKey="absCoefficient" name="Impact Magnitude" isAnimationActive={false} radius={[0, 2, 2, 0]}>
                      {importance.slice(0, 12).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.direction === 'positive' ? CHART_COLORS.red : CHART_COLORS.green} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
              {!loading && importance.length > 0 && (
                <div className="mt-4 space-y-2 text-sm text-foreground leading-relaxed">
                  <p>This chart plots the absolute logistic regression coefficients. Features in <strong className="text-red-600 dark:text-red-400">red</strong> drive churn higher (positive coefficient). Features in <strong className="text-green-600 dark:text-green-400">green</strong> protect against churn (negative coefficient).</p>
                  <p>Total tenure is our strongest shield, acting as a massive negative coefficient against churn. Conversely, Month-to-Month contracts and Fiber Optic infrastructure are the strongest drivers accelerating churn, defining the operational battleground.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 7: Recommendations */}
          <Card className="shadcn-card border-border">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5" />
                7. Business Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loading || !recommendations.length ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 rounded-lg border bg-card/50 flex flex-col md:flex-row gap-4 items-start">
                      <div className="shrink-0 mt-1">
                        {rec.priority === "High" && <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100 border-red-200 dark:border-red-800">High Priority</Badge>}
                        {rec.priority === "Medium" && <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100 border-amber-200 dark:border-amber-800">Medium Priority</Badge>}
                        {rec.priority === "Low" && <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 border-blue-200 dark:border-blue-800">Low Priority</Badge>}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <h4 className="font-bold text-base flex items-center gap-1.5">
                          {rec.title}
                        </h4>
                        <p className="text-sm text-foreground">{rec.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Impact</p>
                            <p className="text-sm">{rec.impact}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Action</p>
                            <p className="text-sm font-medium">{rec.action}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
