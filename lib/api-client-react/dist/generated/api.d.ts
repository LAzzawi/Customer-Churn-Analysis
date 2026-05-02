import type { QueryKey, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ChurnDistribution, ChurnOverview, FeatureChurnRate, FeatureImportance, HealthStatus, ModelEvaluation, Recommendation } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get overall churn statistics
 */
export declare const getGetChurnOverviewUrl: () => string;
export declare const getChurnOverview: (options?: RequestInit) => Promise<ChurnOverview>;
export declare const getGetChurnOverviewQueryKey: () => readonly ["/api/churn/overview"];
export declare const getGetChurnOverviewQueryOptions: <TData = Awaited<ReturnType<typeof getChurnOverview>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChurnOverview>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getChurnOverview>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetChurnOverviewQueryResult = NonNullable<Awaited<ReturnType<typeof getChurnOverview>>>;
export type GetChurnOverviewQueryError = ErrorType<unknown>;
/**
 * @summary Get overall churn statistics
 */
export declare function useGetChurnOverview<TData = Awaited<ReturnType<typeof getChurnOverview>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChurnOverview>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get churn distribution across segments
 */
export declare const getGetChurnDistributionUrl: () => string;
export declare const getChurnDistribution: (options?: RequestInit) => Promise<ChurnDistribution>;
export declare const getGetChurnDistributionQueryKey: () => readonly ["/api/churn/distribution"];
export declare const getGetChurnDistributionQueryOptions: <TData = Awaited<ReturnType<typeof getChurnDistribution>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChurnDistribution>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getChurnDistribution>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetChurnDistributionQueryResult = NonNullable<Awaited<ReturnType<typeof getChurnDistribution>>>;
export type GetChurnDistributionQueryError = ErrorType<unknown>;
/**
 * @summary Get churn distribution across segments
 */
export declare function useGetChurnDistribution<TData = Awaited<ReturnType<typeof getChurnDistribution>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChurnDistribution>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get churn rate by feature values
 */
export declare const getGetChurnFeaturesUrl: () => string;
export declare const getChurnFeatures: (options?: RequestInit) => Promise<FeatureChurnRate[]>;
export declare const getGetChurnFeaturesQueryKey: () => readonly ["/api/churn/features"];
export declare const getGetChurnFeaturesQueryOptions: <TData = Awaited<ReturnType<typeof getChurnFeatures>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChurnFeatures>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getChurnFeatures>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetChurnFeaturesQueryResult = NonNullable<Awaited<ReturnType<typeof getChurnFeatures>>>;
export type GetChurnFeaturesQueryError = ErrorType<unknown>;
/**
 * @summary Get churn rate by feature values
 */
export declare function useGetChurnFeatures<TData = Awaited<ReturnType<typeof getChurnFeatures>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChurnFeatures>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get logistic regression model evaluation metrics
 */
export declare const getGetChurnModelUrl: () => string;
export declare const getChurnModel: (options?: RequestInit) => Promise<ModelEvaluation>;
export declare const getGetChurnModelQueryKey: () => readonly ["/api/churn/model"];
export declare const getGetChurnModelQueryOptions: <TData = Awaited<ReturnType<typeof getChurnModel>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChurnModel>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getChurnModel>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetChurnModelQueryResult = NonNullable<Awaited<ReturnType<typeof getChurnModel>>>;
export type GetChurnModelQueryError = ErrorType<unknown>;
/**
 * @summary Get logistic regression model evaluation metrics
 */
export declare function useGetChurnModel<TData = Awaited<ReturnType<typeof getChurnModel>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChurnModel>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get logistic regression feature coefficients
 */
export declare const getGetFeatureImportanceUrl: () => string;
export declare const getFeatureImportance: (options?: RequestInit) => Promise<FeatureImportance[]>;
export declare const getGetFeatureImportanceQueryKey: () => readonly ["/api/churn/feature-importance"];
export declare const getGetFeatureImportanceQueryOptions: <TData = Awaited<ReturnType<typeof getFeatureImportance>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFeatureImportance>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFeatureImportance>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFeatureImportanceQueryResult = NonNullable<Awaited<ReturnType<typeof getFeatureImportance>>>;
export type GetFeatureImportanceQueryError = ErrorType<unknown>;
/**
 * @summary Get logistic regression feature coefficients
 */
export declare function useGetFeatureImportance<TData = Awaited<ReturnType<typeof getFeatureImportance>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFeatureImportance>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get actionable business recommendations
 */
export declare const getGetChurnRecommendationsUrl: () => string;
export declare const getChurnRecommendations: (options?: RequestInit) => Promise<Recommendation[]>;
export declare const getGetChurnRecommendationsQueryKey: () => readonly ["/api/churn/recommendations"];
export declare const getGetChurnRecommendationsQueryOptions: <TData = Awaited<ReturnType<typeof getChurnRecommendations>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChurnRecommendations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getChurnRecommendations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetChurnRecommendationsQueryResult = NonNullable<Awaited<ReturnType<typeof getChurnRecommendations>>>;
export type GetChurnRecommendationsQueryError = ErrorType<unknown>;
/**
 * @summary Get actionable business recommendations
 */
export declare function useGetChurnRecommendations<TData = Awaited<ReturnType<typeof getChurnRecommendations>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChurnRecommendations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map