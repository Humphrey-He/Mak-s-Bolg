import { blogSeriesBySlug } from "@/data/blogSeries";

export type ReadingTopicFilter = "All" | "agent" | "backend";
export type ReadingTypeFilter = "All" | "book" | "paper" | "project";

export type ReadingFilterable = {
  topic?: string;
  type: string;
};

export type ReadingFilters = {
  topic: ReadingTopicFilter;
  type: ReadingTypeFilter;
};

const readingTopics = new Set<ReadingTopicFilter>(["All", "agent", "backend"]);
const readingTypes = new Set<ReadingTypeFilter>(["All", "book", "paper", "project"]);

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeBlogSeriesFilter(value: string | string[] | undefined): string {
  const series = firstParam(value);
  return series && blogSeriesBySlug.has(series) ? series : "All";
}

export function normalizeReadingFilters(params: {
  topic?: string | string[];
  type?: string | string[];
}): ReadingFilters {
  const topic = firstParam(params.topic);
  const type = firstParam(params.type);

  return {
    topic: topic && readingTopics.has(topic as ReadingTopicFilter) ? (topic as ReadingTopicFilter) : "All",
    type: type && readingTypes.has(type as ReadingTypeFilter) ? (type as ReadingTypeFilter) : "All",
  };
}

export function filterReadings<T extends ReadingFilterable>(items: T[], filters: ReadingFilters): T[] {
  return items.filter((item) => {
    const matchTopic = filters.topic === "All" || item.topic === filters.topic;
    const matchType = filters.type === "All" || item.type === filters.type;
    return matchTopic && matchType;
  });
}
