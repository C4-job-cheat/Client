import * as React from "react";

import { cn } from "./utils";

function Card({ className, variant = 'default', ...props }: React.ComponentProps<"div"> & {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass'
}) {
  const variants = {
    default: "bg-white border border-neutral-200 shadow-card",
    elevated: "bg-white border border-neutral-200 shadow-card-hover",
    bordered: "bg-white border-2 border-neutral-900",
    glass: "bg-white/80 backdrop-blur-sm border border-neutral-200/50 shadow-card"
  }
  
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl transition-all duration-300 hover:shadow-card-hover",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn(
        "font-heading text-xl font-bold leading-none tracking-tight text-neutral-900",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("font-body text-sm text-neutral-600", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
