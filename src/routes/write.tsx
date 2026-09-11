import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bold,
  ChevronLeft,
  Heading2,
  Italic,
  List,
  Quote,
  Search,
  Trash2,
  Underline,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { applySavedAppearance } from "@/lib/theme";
import {
  LIBRARY_EVENT,
  citationStyles,
  formatInline,
  formatReference,
  loadLibrary,
  removeFromLibrary,
  type CitationStyle,
  type SavedPaper,
} from "@/lib/library";

export const Route = createFileRoute("/write")({
  head: () => ({
    meta: [
      { title: "Writing Workspace — Orbis Research" },
      {
        name: "description",
        content:
          "Draft academic writing beside your saved sources, with automatic inline citations and a live bibliography in APA, IEEE, Harvard, MLA or Chicago.",
      },
      { property: "og:title", content: "Writing Workspace — Orbis Research" },
      {
        property: "og:description",
        content: "A split-screen source library and document editor with an automated citation engine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WritingWorkspace,
});

const DOC_KEY = "orbis-document";
const STYLE_KEY = "orbis-citation-style";

function WritingWorkspace() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [library, setLibrary] = useState<SavedPaper[]>([]);
  const [style, setStyle] = useState<CitationStyle>("apa");
  const [citedIds, setCitedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    applySavedAppearance();
    setLibrary(loadLibrary());
    const saved = window.localStorage.getItem(STYLE_KEY) as CitationStyle | null;
    if (saved && citationStyles.some((item) => item.id === saved)) setStyle(saved);
    const html = window.localStorage.getItem(DOC_KEY);
    if (html && editorRef.current) editorRef.current.innerHTML = html;
    setReady(true);
    const sync = () => setLibrary(loadLibrary());
    window.addEventListener(LIBRARY_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(LIBRARY_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  /** Read citation markers out of the document, in reading order. */
  const syncCitations = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const markers = Array.from(editor.querySelectorAll<HTMLElement>("[data-cite]"));
    const order: string[] = [];
    for (const marker of markers) {
      const id = marker.dataset["cite"]!;
      if (!order.includes(id)) order.push(id);
    }
    for (const marker of markers) {
      const id = marker.dataset["cite"]!;
      const paper = library.find((item) => item.id === id);
      if (paper) marker.textContent = formatInline(paper, style, order.indexOf(id) + 1);
    }
    setCitedIds(order);
    window.localStorage.setItem(DOC_KEY, editor.innerHTML);
  }, [library, style]);

  useEffect(() => {
    if (ready) syncCitations();
  }, [ready, syncCitations]);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STYLE_KEY, style);
  }, [ready, style]);

  const bibliography = useMemo(
    () =>
      citedIds
        .map((id) => library.find((item) => item.id === id))
        .filter((paper): paper is SavedPaper => Boolean(paper)),
    [citedIds, library],
  );

  const focusEditor = () => {
    const editor = editorRef.current;
    if (!editor) return;
    if (!editor.contains(document.getSelection()?.anchorNode ?? null)) {
      editor.focus();
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    } else {
      editor.focus();
    }
  };

  const insert = (html: string) => {
    focusEditor();
    document.execCommand("insertHTML", false, html);
    syncCitations();
  };

  const escapeHtml = (text: string) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const marker = (paper: SavedPaper) =>
    `<span data-cite="${paper.id}" class="cite-marker">${formatInline(paper, style, 1)}</span>`;

  const citePaper = (paper: SavedPaper) => insert(`${marker(paper)}&nbsp;`);

  const insertQuote = (paper: SavedPaper) => {
    const source = paper.abstract_snippet ?? "";
    insert(`<p>&ldquo;${escapeHtml(source)}&rdquo; ${marker(paper)}</p><p><br></p>`);
  };

  const format = (command: string, value?: string) => {
    focusEditor();
    document.execCommand(command, false, value);
    syncCitations();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[100rem] items-center gap-3 px-4 sm:px-6">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link to="/" aria-label="Back to research canvas">
              <ChevronLeft />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="font-display truncate text-base font-semibold sm:text-lg">Writing workspace</h1>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              Sources on the left, your manuscript on the right
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-1.5">
            <span className="hidden text-[11px] font-semibold uppercase text-muted-foreground lg:inline">Citation style</span>
            {citationStyles.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStyle(item.id)}
                aria-pressed={style === item.id}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  style === item.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[100rem] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <section aria-label="Saved papers and source library" className="rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-display text-sm font-semibold">Source library</p>
              <p className="text-[11px] text-muted-foreground">{library.length} saved paper{library.length === 1 ? "" : "s"}</p>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/search" search={{ q: undefined }}>
                <Search /> Find
              </Link>
            </Button>
          </div>

          <div className="mt-4 space-y-3 lg:max-h-[calc(100vh-16rem)] lg:overflow-y-auto">
            {library.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                Save papers from Search &amp; discovery and they will appear here, ready to cite.
              </p>
            )}
            {library.map((paper) => {
              const position = citedIds.indexOf(paper.id);
              return (
                <article key={paper.id} className="rounded-2xl border border-border bg-background p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold leading-snug">{paper.title}</p>
                    <button
                      type="button"
                      onClick={() => setLibrary(removeFromLibrary(paper.id))}
                      className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                      aria-label={`Remove ${paper.title} from library`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">
                    {[paper.authors[0], paper.year, paper.venue].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <Button size="sm" className="h-8 rounded-full px-3 text-[11px]" onClick={() => citePaper(paper)}>
                      Cite
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-full px-3 text-[11px]"
                      onClick={() => insertQuote(paper)}
                    >
                      <Quote /> Quote
                    </Button>
                    {position >= 0 && (
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-secondary-foreground">
                        Ref {position + 1}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section aria-label="Document editor" className="rounded-3xl border border-border bg-card p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-4">
            {[
              { icon: Bold, command: "bold", label: "Bold" },
              { icon: Italic, command: "italic", label: "Italic" },
              { icon: Underline, command: "underline", label: "Underline" },
              { icon: List, command: "insertUnorderedList", label: "Bullet list" },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <Button
                  key={tool.command}
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full"
                  onClick={() => format(tool.command)}
                  aria-label={tool.label}
                  title={tool.label}
                >
                  <Icon />
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full"
              onClick={() => format("formatBlock", "<h2>")}
              aria-label="Heading"
              title="Heading"
            >
              <Heading2 />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => format("formatBlock", "<p>")}
            >
              Body text
            </Button>
            <span className="ml-auto text-[11px] text-muted-foreground">Draft saved on this device</span>
          </div>

          <div
            ref={editorRef}
            className="document-editor mt-5 min-h-[24rem] outline-none"
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label="Document body"
            onInput={syncCitations}
            onBlur={syncCitations}
          >
            <h2>Untitled manuscript</h2>
            <p>Start writing here. Use Cite or Quote on any saved paper to drop a citation into the text.</p>
          </div>

          <div className="mt-8 border-t border-border pt-5">
            <h3 className="font-display text-sm font-semibold">
              References {bibliography.length > 0 && <span className="text-muted-foreground">({bibliography.length})</span>}
            </h3>
            {bibliography.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Citations you insert build this list automatically, in {citationStyles.find((s) => s.id === style)?.label} order.
              </p>
            ) : (
              <ol className="mt-3 space-y-2">
                {bibliography.map((paper, index) => (
                  <li key={paper.id} className="text-xs leading-6 text-muted-foreground">
                    {formatReference(paper, style, index + 1)}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
