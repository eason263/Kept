"use client";

import { motion } from "motion/react";
import Link from "next/link";

/** next/link with Motion props (initial/animate/whileHover…). */
export const MotionLink = motion.create(Link);
