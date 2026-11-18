import { Fragment, type ReactNode } from "react";
import { HouseIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "../../components/breadcrumb.js";
import { cn } from "../../lib/utils.js";

export type AppHeaderBreadcrumb = {
  label: string;
  href?: string;
  emphasis?: boolean;
};

export type AppHeaderProps = {
  actionsAlignment?: "edge" | "workspace" | "form";
  actions?: ReactNode;
  breadcrumbs: AppHeaderBreadcrumb[];
  homeHref: string;
  name?: string;
  className?: string;
};

export function AppHeader({
  actionsAlignment = "edge",
  actions,
  breadcrumbs,
  homeHref,
  name,
  className
}: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={cn(
        "flex min-h-10 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 py-0",
        actionsAlignment === "workspace" && "pr-[calc(5%+var(--workspace-scrollbar-inset,0px))]",
        className
      )}
    >
      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="flex-nowrap overflow-hidden">
          <BreadcrumbItem className="shrink-0">
            <BreadcrumbLink aria-label="Go to overview" href={homeHref}>
              <HouseIcon aria-hidden="true" className="size-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={`${crumb.label}-${index}`}>
              <BreadcrumbSeparator className="shrink-0" />
              <BreadcrumbItem className="min-w-0 flex-nowrap">
                {crumb.href ? (
                  <BreadcrumbLink className={cn("truncate", index === breadcrumbs.length - 1 && "font-semibold", crumb.emphasis && "text-base font-semibold")} href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                ) : index < breadcrumbs.length - 1 ? (
                  <span className={cn("truncate", crumb.emphasis && "text-base font-semibold")}>{crumb.label}</span>
                ) : (
                  <BreadcrumbPage className={cn("truncate", crumb.emphasis ? "text-base font-semibold" : "font-semibold")}>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {name || actions ? (
        <div
          className={cn(
            "flex shrink-0 items-center gap-2",
            actionsAlignment === "form" && "mr-4 lg:mr-[max(2rem,calc((100%-72rem)/2))]"
          )}
        >
          {name ? <span className="text-sm font-medium text-muted-foreground">{name}</span> : null}
          {actions}
        </div>
      ) : null}
    </header>
  );
}
