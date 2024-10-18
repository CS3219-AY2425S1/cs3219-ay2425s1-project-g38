import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";
import { DM_Mono as FontLogo } from "next/font/google";
import { DM_Sans as FontFun } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontLogo = FontLogo({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-logo",
});

export const fontFun = FontFun({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-fun",
});
