import type { CollectionEntry } from "astro:content";
import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import config from "@/config";
import { resolveTimezone } from "./resolveTimezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 文章在页面上「实际显示」的日期：有 modDatetime 就用它，否则用 pubDatetime，
 * 并统一换算到站点时区。
 *
 * 列表排序、年份分组、归档分组都必须用它，否则会出现
 * 「同一篇文章在列表里显示 2026 年、在归档里却被归到 2024 年」的矛盾。
 */
export function getPostDate(post: CollectionEntry<"posts">): Dayjs {
  return dayjs(post.data.modDatetime ?? post.data.pubDatetime).tz(
    resolveTimezone(post.data.timezone ?? config.site.timezone)
  );
}
