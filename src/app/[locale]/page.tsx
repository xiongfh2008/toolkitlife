"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  HOME_SCENES,
  POPULAR_TOOLS,
  SEARCH_ALIASES,
} from "@/data/home";

interface Tool {
  name: string;
  description: string;
  href: string;
  icon: string;
  category: string;
}

const RECENT_KEY = "tp:recent";
const FAVORITES_KEY = "tp:favorites";

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

function decodeIcon(str: string): string {
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

export default function HomePage() {
  const t = useTranslations("home");
  const toolsRecord = t.raw("tools") as Record<string, Omit<Tool, "href">>;

  const tools: Tool[] = useMemo(
    () =>
      Object.entries(toolsRecord).map(([slug, tool]) => ({
        ...tool,
        icon: decodeIcon(tool.icon),
        href: `/tools/${slug}`,
      })),
    [toolsRecord]
  );

  const toolsBySlug = useMemo(() => {
    const map = new Map<string, Tool>();
    for (const tool of tools) {
      map.set(tool.href.replace("/tools/", ""), tool);
    }
    return map;
  }, [tools]);

  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  // Combined tab bar: "recent"/"favorites" (history) + scene keys (categories)
  const [activePane, setActivePane] = useState<string>(HOME_SCENES[0].key);

  // Load favorites + recent once on mount, then keep them in sync when the
  // user favorites/uses tools on other pages (client-side navigation does not
  // remount the homepage).
  useEffect(() => {
    const load = () => {
      setFavorites(readList(FAVORITES_KEY));
      setRecent(readList(RECENT_KEY));
    };
    load();
    window.addEventListener("tp:favorites-changed", load);
    window.addEventListener("tp:recent-changed", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("tp:favorites-changed", load);
      window.removeEventListener("tp:recent-changed", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const query = search.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!query) return [];
    return tools.filter((tool) => {
      const slug = tool.href.replace("/tools/", "");
      if (
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      ) {
        return true;
      }
      const aliases = SEARCH_ALIASES[slug];
      if (aliases?.some((a) => a.toLowerCase().includes(query))) return true;
      return false;
    });
  }, [query, tools]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      writeList(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    writeList(RECENT_KEY, []);
    setRecent([]);
  }, []);

  const favoriteTools = favorites
    .map((slug) => toolsBySlug.get(slug))
    .filter((x): x is Tool => Boolean(x));
  const recentTools = recent
    .map((slug) => toolsBySlug.get(slug))
    .filter((x): x is Tool => Boolean(x));

  const hasHistory = recentTools.length > 0 || favoriteTools.length > 0;

  const activeScene = HOME_SCENES.find((s) => s.key === activePane);
  const isHistoryPane = activePane === "recent" || activePane === "favorites";

  const toolsOf = (slugs: string[]) =>
    slugs
      .map((slug) => toolsBySlug.get(slug))
      .filter((x): x is Tool => Boolean(x));

  // Category pane: a scene's own sub-groups (calculator) or flat list.
  const sceneGroups =
    activeScene && activeScene.groups
      ? activeScene.groups.map((g) => ({
          title: t(`scenesGroups.${g.key}`),
          tools: toolsOf(g.tools),
        }))
      : undefined;

  // "all" pane: one sub-group per scene (calculator keeps its sub-groups).
  const allGroups =
    activeScene && activeScene.key === "all"
      ? HOME_SCENES.filter((s) => s.key !== "all").flatMap((s) =>
          s.groups
            ? s.groups.map((g) => ({
                title: t(`scenesGroups.${g.key}`),
                tools: toolsOf(g.tools),
              }))
            : [{ title: t(`scenes.${s.key}`), tools: toolsOf(s.tools ?? []) }]
        )
      : undefined;

  const groups = allGroups ?? sceneGroups;
  const paneTools = groups ? undefined : toolsOf(activeScene?.tools ?? []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <div className="mb-14 text-center">
        {/* SEO title — logo removed from the visible homepage body */}
        <h1 className="sr-only">{t("title")}</h1>
        <p className="mx-auto max-w-lg text-lg text-zinc-400 leading-relaxed">
          {t("subtitle")}
          <br />
          <span className="text-zinc-500">{t("noSignup")}</span>
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-base text-zinc-100 placeholder-zinc-500 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
        </div>
        {/* Popular tools — short line of text links under the search box, no scrollbar */}
        <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-2 text-sm">
          <span className="text-zinc-500">{t("popularLabel")}</span>
          {POPULAR_TOOLS.map((slug) => {
            const tool = toolsBySlug.get(slug);
            if (!tool) return null;
            return (
              <Link
                key={slug}
                href={tool.href}
                className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              >
                <span className="mr-1">{tool.icon}</span>
                {tool.name}
              </Link>
            );
          })}
        </div>
      </div>

      {query ? (
        /* Search results — full grid with favorite stars */
        <div>
          {searchResults.length === 0 && (
            <p className="text-center text-zinc-500">{t("noResults")}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((tool) => {
              const slug = tool.href.replace("/tools/", "");
              return (
                <ToolCard
                  key={tool.href}
                  tool={tool}
                  isFavorite={favorites.includes(slug)}
                  onToggleFavorite={() => toggleFavorite(slug)}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* Combined tab bar — history tabs (left) + category tabs */}
          <div className="mb-8">
            <TabBar>
              {hasHistory && (
                <>
                  <TabButton
                    active={activePane === "recent"}
                    onClick={() => setActivePane("recent")}
                  >
                    {t("recent")}
                  </TabButton>
                  <TabButton
                    active={activePane === "favorites"}
                    onClick={() => setActivePane("favorites")}
                  >
                    {t("favorites")}
                  </TabButton>
                </>)}
              {HOME_SCENES.map((scene) => (
                <TabButton
                  key={scene.key}
                  active={activePane === scene.key}
                  onClick={() => setActivePane(scene.key)}
                >
                  {t(`scenes.${scene.key}`)}
                </TabButton>
              ))}
            </TabBar>
          </div>

          {/* History pane content */}
          {hasHistory && isHistoryPane ? (
            activePane === "recent" ? (
              recentTools.length > 0 ? (
                <>
                  <div className="mb-4 flex justify-end">
                    <button
                      onClick={clearRecent}
                      className="text-xs text-zinc-500 hover:text-zinc-300"
                    >
                      {t("clearHistory")}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                    {recentTools.map((tool) => {
                      const slug = tool.href.replace("/tools/", "");
                      return (
                        <ToolChip
                          key={tool.href}
                          tool={tool}
                          isFavorite={favorites.includes(slug)}
                          onToggleFavorite={() => toggleFavorite(slug)}
                        />
                      );
                    })}
                  </div>
                </>
              ) : null
            ) : favoriteTools.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {favoriteTools.map((tool) => {
                  const slug = tool.href.replace("/tools/", "");
                  return (
                    <ToolChip
                      key={tool.href}
                      tool={tool}
                      isFavorite
                      onToggleFavorite={() => toggleFavorite(slug)}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-sm text-zinc-500">
                {t("emptyFavorites")}
              </p>
            )
          ) : (
            /* Active category scene content */
            activeScene && (
              <SceneSection
                groups={groups}
                tools={paneTools}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            )
          )}
        </>
      )}
    </div>
  );
}

/* ---------- Tab bar (connected, single row, underline indicator) ---------- */

function TabBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-stretch overflow-hidden border-b border-zinc-800">
      {children}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-w-0 flex-1 shrink truncate cursor-pointer border-b-2 px-2 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-blue-600 text-zinc-100"
          : "border-transparent text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------- Tool card (search grid) ---------- */

function ToolCard({
  tool,
  isFavorite,
  onToggleFavorite,
}: {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <div className="relative rounded-xl border border-zinc-700 bg-zinc-900 transition-all hover:border-blue-500/50 hover:shadow-md">
      <Link href={tool.href} className="group block p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-800 text-xl">
            {tool.icon}
          </span>
          <h2 className="pr-6 text-lg font-semibold text-zinc-100 group-hover:text-blue-600 transition-colors">
            {tool.name}
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-zinc-400">
          {tool.description}
        </p>
        <span className="mt-3 inline-block rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-500">
          {tool.category}
        </span>
      </Link>
      <button
        onClick={onToggleFavorite}
        className={`absolute right-4 top-4 text-xl transition-colors ${
          isFavorite ? "text-amber-500" : "text-zinc-600 hover:text-amber-400"
        }`}
        aria-label="toggle favorite"
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </div>
  );
}

/* ---------- Scene section ---------- */

function SceneSection({
  tools,
  groups,
  favorites,
  onToggleFavorite,
}: {
  tools?: Tool[];
  groups?: { title: string; tools: Tool[] }[];
  favorites: string[];
  onToggleFavorite: (slug: string) => void;
}) {
  const renderTool = (tool: Tool) => {
    const slug = tool.href.replace("/tools/", "");
    return (
      <ToolChip
        key={tool.href}
        tool={tool}
        isFavorite={favorites.includes(slug)}
        onToggleFavorite={() => onToggleFavorite(slug)}
      />
    );
  };

  if (groups) {
    return (
      <section>
        <div className="space-y-6">
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="mb-2.5 text-sm font-medium text-zinc-500">
                {g.title}
              </h3>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {g.tools.map(renderTool)}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {(tools ?? []).map(renderTool)}
      </div>
    </section>
  );
}

function ToolChip({
  tool,
  isFavorite,
  onToggleFavorite,
}: {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <div className="relative flex min-h-[104px] flex-col rounded-lg border border-zinc-700 bg-zinc-900 p-3 transition-colors hover:border-blue-500/50">
      <Link href={tool.href} className="group flex min-w-0 flex-1 flex-col pr-7">
        <span className="mb-1.5 flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-base">
            {tool.icon}
          </span>
          <span className="truncate font-medium text-zinc-200 transition-colors group-hover:text-blue-600">
            {tool.name}
          </span>
        </span>
        <span className="text-xs leading-relaxed text-zinc-500 line-clamp-2">
          {tool.description}
        </span>
      </Link>
      <button
        onClick={onToggleFavorite}
        className={`absolute right-2.5 top-2.5 text-lg leading-none transition-colors ${
          isFavorite ? "text-amber-500" : "text-zinc-500 hover:text-amber-400"
        }`}
        aria-label="toggle favorite"
        title={isFavorite ? "★" : "☆"}
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </div>
  );
}
