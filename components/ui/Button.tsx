"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={cn("rounded-full bg-primary text-white px-4 py-2", className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";
