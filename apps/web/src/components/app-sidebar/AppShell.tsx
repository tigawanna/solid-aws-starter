import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TSRBreadCrumbs } from "@/lib/tanstack/router/TSRBreadCrumbs";
import { Link, Outlet } from "@tanstack/solid-router";
import { FiMessageSquare, FiMonitor, FiMoon, FiServer, FiSun } from "solid-icons/fi";
import { Match, Switch, type JSX } from "solid-js";
import { useThemeContext, type Theme } from "~/components/theme/theme-provider";
import { Logo } from "../icon/logo";
import { SidebarLinks, type SidebarItem } from "./sidebar-links";

const sidebarRoutes: SidebarItem[] = [
  { title: "Messages", href: "/messages", icon: FiMessageSquare },
  { title: "SSE", href: "/sse", icon: FiServer },
];

export function AppShell(props: { children?: JSX.Element; defaultOpen?: boolean }) {
  return (
    <SidebarProvider defaultOpen={props.defaultOpen ?? true} class="h-svh overflow-hidden">
      <Sidebar collapsible="icon">
        <SidebarHeader class="border-sidebar-border h-12 w-full flex-row items-center border-b px-3 py-0">
          <Link to="/" class="flex w-full flex-row items-center justify-center gap-2">
            <Logo class="text-primary size-8 shrink-0" />
            <span class="truncate text-base font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
              Solid AWS Starter
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarLinks links={sidebarRoutes} />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter class="border-sidebar-border border-t">
          <ThemeControl />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset class="min-h-0">
        <header class="bg-background sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <TSRBreadCrumbs />
        </header>
        <div class="@container/main flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-auto p-4 md:p-6">
          {props.children ?? <Outlet />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const themeLabels: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

function ThemeControl() {
  const { theme, setTheme } = useThemeContext();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu placement="top-start">
          <DropdownMenuTrigger as={SidebarMenuButton} tooltip="Theme" class="w-full">
            <Switch>
              <Match when={theme() === "dark"}>
                <FiMoon class="size-4" />
              </Match>
              <Match when={theme() === "light"}>
                <FiSun class="size-4" />
              </Match>
              <Match when={theme() === "system"}>
                <FiMonitor class="size-4" />
              </Match>
            </Switch>
            <span class="group-data-[collapsible=icon]:hidden">{themeLabels[theme()]}</span>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent class="min-w-40">
              <DropdownMenuRadioGroup
                value={theme()}
                onChange={(value) => setTheme(value as Theme)}
              >
                <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
