"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { reveal } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  variants?: Variants;
  as?: "div" | "section" | "article" | "li" | "ul" | "header" | "footer";
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  amount = 0.25,
  variants = reveal,
  as = "div",
}: Props) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ delay }}
      variants={variants}
    >
      {children}
    </Comp>
  );
}
