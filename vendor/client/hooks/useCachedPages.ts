import { useEffect, useState } from "react";

export function useCachedPages() {
  const [cachedPages, setCachedPages] = useState<Array<{ name: string; url: string; size: number }>>([]);
  const [cacheSize, setCacheSize] = useState(0);

  useEffect(() => {
    if ("caches" in window) {
      caches.open("overreact-v1").then((cache) => {
        cache.keys().then((requests) => {
          const pages = requests
            .map((req) => ({
              url: req.url,
              name: req.url.split("/").pop()?.replace(".js", "") || "",
            }))
            .filter((page) => page.name && !["offline", "timeout", "bootstrap", "error"].includes(page.name))
            .map((page) => ({
              ...page,
              size: 0,
            }));

          setCachedPages(pages);

          // Calculate total cache size
          let totalSize = 0;
          Promise.all(
            requests.map((req) =>
              cache.match(req).then((response) => {
                if (response) {
                  return response.blob().then((blob) => {
                    totalSize += blob.size;
                  });
                }
              })
            )
          ).then(() => {
            setCacheSize(totalSize);
          });
        });
      });
    }
  }, []);

  const clearCache = async () => {
    if ("caches" in window) {
      await caches.delete("overreact-v1");
      setCachedPages([]);
      setCacheSize(0);
    }
  };

  const clearPage = async (url: string) => {
    if ("caches" in window) {
      const cache = await caches.open("overreact-v1");
      await cache.delete(url);
      setCachedPages((prev) => prev.filter((page) => page.url !== url));
    }
  };

  return {
    cachedPages,
    cacheSize,
    clearCache,
    clearPage,
  };
}
