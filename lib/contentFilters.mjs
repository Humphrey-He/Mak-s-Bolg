const blogSeriesSlugs = new Set([
  "ai-agent",
  "docker",
  "kubernetes",
  "redis-core",
  "distributed-cache",
  "rpc-core",
  "ddd-core",
  "elasticsearch-core",
  "go-modules",
  "go-high-concurrency",
  "kafka-sarama",
  "mysql",
  "java-design-patterns",
  "rocketmq",
  "sdd",
  "gateway-apisix",
  "cloud-native-notes",
  "engineering-notes",
]);

const readingTopics = new Set(["All", "agent", "backend"]);
const readingTypes = new Set(["All", "book", "paper", "project"]);

function firstParam(value) {
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeBlogSeriesFilter(value) {
  const series = firstParam(value);
  return series && blogSeriesSlugs.has(series) ? series : "All";
}

export function normalizeReadingFilters(params) {
  const topic = firstParam(params.topic);
  const type = firstParam(params.type);

  return {
    topic: topic && readingTopics.has(topic) ? topic : "All",
    type: type && readingTypes.has(type) ? type : "All",
  };
}

export function filterReadings(items, filters) {
  return items.filter((item) => {
    const matchTopic = filters.topic === "All" || item.topic === filters.topic;
    const matchType = filters.type === "All" || item.type === filters.type;
    return matchTopic && matchType;
  });
}
