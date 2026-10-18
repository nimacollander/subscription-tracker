"use client";

import { SORT_OPTIONS, type SortOption, type SubscriptionQuery } from "@/lib/subscriptionQuery";

type SubscriptionFiltersProps = {
  query: SubscriptionQuery;
  categories: string[];
  counts: { active: number; paused: number };
  onChange: (query: SubscriptionQuery) => void;
};

const controlClass =
  "h-11 w-full rounded-xl border border-border bg-surface-2 px-3.5 text-sm outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/30";
const labelClass = "text-[13px] font-medium text-muted";

export function SubscriptionFilters({ query, categories, counts, onChange }: SubscriptionFiltersProps) {
  const set = <K extends keyof SubscriptionQuery>(key: K, value: SubscriptionQuery[K]) =>
    onChange({ ...query, [key]: value });

  return (
    <div
      role="search"
      className="grid gap-4 rounded-3xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]"
    >
      <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
        <label htmlFor="filter-search" className={labelClass}>
          Search
        </label>
        <input
          id="filter-search"
          type="search"
          value={query.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Search by name"
          autoComplete="off"
          className={controlClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-category" className={labelClass}>
          Category
        </label>
        <select
          id="filter-category"
          value={query.category}
          onChange={(e) => set("category", e.target.value)}
          className={controlClass}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-status" className={labelClass}>
          Status
        </label>
        <select
          id="filter-status"
          value={query.status}
          onChange={(e) => set("status", e.target.value as SubscriptionQuery["status"])}
          className={controlClass}
        >
          <option value="all">All statuses</option>
          <option value="active">Active ({counts.active})</option>
          <option value="paused">Paused ({counts.paused})</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-sort" className={labelClass}>
          Sort by
        </label>
        <select
          id="filter-sort"
          value={query.sort}
          onChange={(e) => set("sort", e.target.value as SortOption)}
          className={controlClass}
        >
          {Object.entries(SORT_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
