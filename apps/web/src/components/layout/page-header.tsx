import type { ComponentProps } from "solid-js";
import { Show, splitProps } from "solid-js";

import { cx } from "~/lib/cva";

export type PageHeaderProps = ComponentProps<"div"> & {
  title: string;
  description?: string;
};

export function PageHeader(props: PageHeaderProps) {
  const [, rest] = splitProps(props, ["class", "title", "description", "children"]);

  return (
    <div class={cx("flex flex-col gap-1", props.class)} {...rest}>
      <h1 class="text-2xl font-semibold tracking-tight">{props.title}</h1>
      <Show when={props.description}>
        <p class="text-muted-foreground text-sm">{props.description}</p>
      </Show>
      {props.children}
    </div>
  );
}
