import { queryOptions, useQuery } from "@tanstack/solid-query";
import { createFileRoute } from "@tanstack/solid-router";
import { For, Match, Show, Switch } from "solid-js";
import { ErrorTemplate } from "~/components/error/ErrorTemplate";
import { PageHeader } from "~/components/layout/page-header";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getMessages } from "~/data-access-layer/messages";
import { formatCount } from "~/lib/format";
import { RouterPendingComponent } from "~/lib/tanstack/router/RouterPendingComponent";

const messagesQueryOptions = queryOptions({
  queryKey: ["messages"],
  queryFn: getMessages,
});

export const Route = createFileRoute("/(dashboard)/messages")({
  loader: ({ context }) => context.queryClient.query(messagesQueryOptions),
  component: PageComponent,
  pendingComponent: () => (
    <div class="flex flex-col gap-4 h-full">
      <RouterPendingComponent />
    </div>
  ),
});

function PageComponent() {
  const messagesQuery = useQuery(() => messagesQueryOptions);
  const messages = () => messagesQuery.data ?? [];

  return (
    <div class="flex w-full flex-col gap-6">
      <PageHeader
        title="Messages"
        description="Server-loaded messages fetched through TanStack Query."
      />
      <Switch>
        <Match when={messagesQuery.isPending}>
          <RouterPendingComponent />
        </Match>
        <Match when={messagesQuery.isError}>
          <ErrorTemplate error={messagesQuery.error} onRetry={() => void messagesQuery.refetch()} />
        </Match>
        <Match when={messagesQuery.isSuccess}>
          <Card>
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
              <CardDescription>Messages returned by the example server function.</CardDescription>
              <CardAction>
                <Badge variant="secondary" class="tabular-nums">
                  {formatCount(messages().length, "message")}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Show
                when={messages().length > 0}
                fallback={<p class="text-muted-foreground text-sm">No messages yet.</p>}
              >
                <ul class="divide-y divide-border">
                  <For each={messages()}>
                    {(message) => (
                      <li class="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <div class="flex min-w-0 flex-col gap-1">
                          <span class="font-medium break-words">{message.content}</span>
                          <span class="text-muted-foreground text-xs tabular-nums">
                            Message #{message.id}
                          </span>
                        </div>
                      </li>
                    )}
                  </For>
                </ul>
              </Show>
            </CardContent>
          </Card>
        </Match>
      </Switch>
    </div>
  );
}
