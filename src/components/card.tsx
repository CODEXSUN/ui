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

/** A single native link around a card; children must not contain interactive controls. */
function CardLink({href,onNavigate,className,...props}:React.ComponentProps<typeof Card>&{href:string;onNavigate?:(href:string)=>void}){
  return <a href={href} onClick={event=>{if(onNavigate&&!event.defaultPrevented&&event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();onNavigate(href);}}} className="group block min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><Card {...props} className={cn('h-full transition-[transform,box-shadow,border-color] duration-200 ease-out group-hover:border-primary/40 group-hover:shadow-md motion-safe:group-hover:-translate-y-0.5 motion-reduce:transition-none',className)}/></a>;
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
  CardLink,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
