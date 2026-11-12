import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://otthonodpiaca.hu",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
