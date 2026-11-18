import type { CollectionEntry } from "astro:content";
import { BLOG_PATH } from "@/content.config";

/**
 * 返回文章所在的「一级文件夹名」，用于分类：
 * `src/content/posts/study/foo.md` → `"study"`
 * `src/content/posts/foo.md`        → `""`（未分类）
 *
 * 注意：不能用 `post.id`，因为文章 frontmatter 里写了 `slug` 时，
 * Astro 会用 slug 作为 id，路径信息就丢了。
 */
export function getPostFolder(post: CollectionEntry<"posts">): string {
  const relativePath = (post.filePath ?? "").replace(BLOG_PATH, "");
  const segments = relativePath.split("/").filter(Boolean);
  return segments.length > 1 ? segments[0] : "";
}
