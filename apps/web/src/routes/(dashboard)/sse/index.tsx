import { createSSE, json, SSEReadyState } from "@solid-primitives/sse";
import { createFileRoute } from "@tanstack/solid-router";
import { createEffect, createSignal, For, on, Show } from "solid-js";
import { PageHeader } from "~/components/layout/page-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { SSE_PATH } from "~/data-access-layer/sse";
import { formatCount } from "~/lib/format";
import { type SsePayload } from "./api.events";

export const Route = createFileRoute("/(dashboard)/sse/")({
  component: RouteComponent,
});

function connectionLabel(state: number) {
  if (state === SSEReadyState.OPEN) return "Open";
  if (state === SSEReadyState.CONNECTING) return "Connecting";
  return "Closed";
}

function RouteComponent() {
  const { data, close, reconnect, readyState } = createSSE<SsePayload>(SSE_PATH, {
    transform: json<SsePayload>,
  });
  const [messages, setMessages] = createSignal<SsePayload[]>([]);

  createEffect(
    on(data, (next) => {
      if (!next) return;

      setMessages((prev) => {
        if (prev.at(-1)?.id === next.id) return prev;
        return [...prev, next];
      });
    }),
  );

  const isOpen = () => readyState() === SSEReadyState.OPEN;
  const isClosed = () => readyState() === SSEReadyState.CLOSED;

  return (
    <div class="flex w-full flex-col gap-6">
      <PageHeader
        title="Server-sent events"
        description="A live event stream pushed from the server with SSE."
      />
      <Card>
        <CardHeader>
          <CardTitle>Event stream</CardTitle>
          <CardDescription>Clear, disconnect, or reconnect to the demo stream.</CardDescription>
          <CardAction>
            <Badge variant={isOpen() ? "default" : "secondary"}>
              {connectionLabel(readyState())}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <ButtonGroup>
              <Button variant="outline" size="sm" onClick={() => setMessages([])}>
                Clear
              </Button>
              <Button variant="outline" size="sm" onClick={() => close()}>
                Disconnect
              </Button>
              <Button variant="outline" size="sm" onClick={() => reconnect()}>
                Reconnect
              </Button>
            </ButtonGroup>
            <span class="text-muted-foreground text-sm tabular-nums">
              {formatCount(messages().length, "event")}
            </span>
          </div>
          <Show
            when={messages().length > 0}
            fallback={
              <p class="text-muted-foreground py-2 text-sm">
                {isClosed() ? "Disconnected." : "Waiting for events…"}
              </p>
            }
          >
            <ul class="divide-y divide-border">
              <For each={messages()}>
                {(message) => (
                  <li class="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <span class="min-w-0 font-medium break-words">{message.content}</span>
                    <span class="text-muted-foreground shrink-0 text-xs tabular-nums">
                      #{message.id}
                    </span>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </CardContent>
      </Card>
    </div>
  );
}
