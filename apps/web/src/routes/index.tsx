import { Link, createFileRoute } from "@tanstack/solid-router";
import { For } from "solid-js";
import { FiArrowRight, FiMessageSquare, FiServer } from "solid-icons/fi";
import { Logo } from "~/components/icon/logo";
import { PageHeader } from "~/components/layout/page-header";
import { ThemeToggle } from "~/components/theme/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Home,
});

const routes = [
  {
    title: "Messages",
    href: "/messages",
    description: "Server-loaded list rendered through TanStack Query.",
    icon: FiMessageSquare,
  },
  {
    title: "Server-sent events",
    href: "/sse",
    description: "A live stream of events pushed from the server.",
    icon: FiServer,
  },
] as const;

const stack = [
  { name: "TanStack Router", detail: "Type-safe file-based routing with SSR loaders." },
  { name: "TanStack Query", detail: "Server-state caching and background refetching." },
  { name: "Kobalte + Tailwind v4", detail: "Accessible primitives styled with design tokens." },
  { name: "AWS CDK", detail: "Infrastructure definitions that deploy alongside the app." },
];

function Home() {
  return (
    <div class="min-h-svh">
      <div class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-8">
        <header class="flex items-center justify-between gap-4">
          <Link to="/" class="flex items-center gap-2">
            <Logo class="text-primary size-8" />
            <span class="text-sm font-medium tracking-tight">Solid AWS Starter</span>
          </Link>
          <ThemeToggle />
        </header>

        <main class="flex flex-col gap-8">
          <PageHeader
            title="Solid + AWS starter"
            description="A minimal fullstack baseline with type-safe routing, server functions, and themed UI primitives."
          />

          <section class="flex flex-col gap-3">
            <h2 class="text-muted-foreground text-sm font-medium">Live routes</h2>
            <ul class="grid gap-4 sm:grid-cols-2">
              <For each={routes}>
                {(route) => {
                  const Icon = route.icon;

                  return (
                    <li>
                      <Link
                        to={route.href}
                        class="group bg-card hover:bg-accent/40 flex h-full flex-col gap-1 rounded-xl border p-5 transition-colors"
                      >
                        <span class="flex items-center gap-2 font-medium">
                          <Icon class="text-muted-foreground size-4" />
                          {route.title}
                        </span>
                        <span class="text-muted-foreground text-sm">{route.description}</span>
                        <span class="text-muted-foreground mt-3 inline-flex items-center gap-1 text-xs">
                          Open
                          <FiArrowRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    </li>
                  );
                }}
              </For>
            </ul>
          </section>

          <section class="flex flex-col gap-3">
            <h2 class="text-muted-foreground text-sm font-medium">Included</h2>
            <ul class="bg-card divide-y divide-border rounded-xl border px-5">
              <For each={stack}>
                {(item) => (
                  <li class="flex flex-col gap-1 py-3 first:pt-4 last:pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <span class="font-medium">{item.name}</span>
                    <span class="text-muted-foreground text-sm sm:text-right">{item.detail}</span>
                  </li>
                )}
              </For>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
