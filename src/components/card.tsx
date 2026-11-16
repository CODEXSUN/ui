import { useDesignSystem } from '../design-system/provider.js';
import type { CardVariant } from '../../contracts/design-system.js';
import * as React from "react"
import { cn } from "../lib/utils.js"

function Card({ className, variant, title, description, action, size, children, ...props }: Omit<React.ComponentProps<"div">, "title"> & { variant?: CardVariant; title?: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode; size?: "default" | "sm" }) {
  const { preferences } = useDesignSystem();
  const selected = variant ?? preferences.card;
  return (
    <div
      data-slot="card" data-variant={selected}
      className={cn(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
        selected === 'outline' && 'shadow-none bg-transparent',
        selected === 'soft' && 'bg-secondary border-transparent shadow-none',
        size === "sm" && "gap-3 py-3 [&_[data-slot=card-header]]:px-3 [&_[data-slot=card-content]]:px-3",
        className
      )}
      {...props}
    >{title || description ? <><CardHeader>{title && <CardTitle>{title}</CardTitle>}{description && <CardDescription>{description}</CardDescription>}{action && <CardAction>{action}</CardAction>}</CardHeader><CardContent>{children}</CardContent></> : children}</div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
