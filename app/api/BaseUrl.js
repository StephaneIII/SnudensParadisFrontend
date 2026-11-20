//base url api1 http://localhost:8080/wp-json/api
//base url api 2 http://localhost:8000/api/


const WORDPRESS_BASE_URL = "http://localhost:8080/wp-json/api/";
const LARAVEL_BASE_URL = "http://localhost:8000/api/";

// API=2 selects WordPress; API=1, missing, or invalid values select Laravel.
const getAPI = (url) => {
  const pageURL = new URL(url);
  const params = pageURL.searchParams;
  const originalParams = params.toString();
  const api = params.get("API") === "2" ? "2" : "1";

  params.delete("API");
  params.append("API", api);

  if (params.toString() !== originalParams) {
    window.history.replaceState(window.history.state, "", pageURL.href);
  }

  return api;
};

export const getUsedAPI = () => {
  const selectedAPI = typeof window === "undefined" ? "1" : getAPI(window.location.href);
  return selectedAPI === "1" ? LARAVEL_BASE_URL : WORDPRESS_BASE_URL;
};
