export function withAPI(href, api) {
  if (!api || !href.startsWith("/") || href.startsWith("//")) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const hash = hashIndex === -1 ? "" : href.slice(hashIndex);
  const withoutHash = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const queryIndex = withoutHash.indexOf("?");
  const path = queryIndex === -1 ? withoutHash : withoutHash.slice(0, queryIndex);
  const params = new URLSearchParams(queryIndex === -1 ? "" : withoutHash.slice(queryIndex + 1));

  if (!params.has("API")) {
    params.set("API", api);
  }

  return `${path}?${params.toString()}${hash}`;
}

export function withCurrentAPI(href) {
  return withAPI(href, new URLSearchParams(window.location.search).get("API"));
}
