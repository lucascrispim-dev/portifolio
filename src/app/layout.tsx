import type { Metadata, Viewport } from "next";
import {
  Inter,
  Space_Mono,
  Caveat,
  Playfair_Display,
  Space_Grotesk,
  JetBrains_Mono,
  EB_Garamond,
} from "next/font/google";
import { projectConfig } from "@/config/project";
import "./globals.css";

const body = Inter({ variable: "--font-body", subsets: ["latin"] });
const system = Space_Mono({
  variable: "--font-system",
  weight: "400",
  subsets: ["latin"],
});

const era1Title = Caveat({
  variable: "--font-era1-title",
  weight: "700",
  subsets: ["latin"],
});
const era2Title = Playfair_Display({
  variable: "--font-era2-title",
  weight: "700",
  subsets: ["latin"],
});
const era3Title = Playfair_Display({
  variable: "--font-era3-title",
  weight: "400",
  style: "italic",
  subsets: ["latin"],
});
const era4Title = Space_Grotesk({
  variable: "--font-era4-title",
  weight: "700",
  subsets: ["latin"],
});
const era5Title = Space_Grotesk({
  variable: "--font-era5-title",
  weight: "500",
  subsets: ["latin"],
});
const era6Title = JetBrains_Mono({
  variable: "--font-era6-title",
  weight: "700",
  subsets: ["latin"],
});
const era7Title = Playfair_Display({
  variable: "--font-era7-title",
  weight: "500",
  style: "italic",
  subsets: ["latin"],
});
const era8Title = EB_Garamond({
  variable: "--font-era8-title",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: projectConfig.projectName,
  description: "Uma experiência narrativa de um único dia.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

const fontVariables = [
  body.variable,
  system.variable,
  era1Title.variable,
  era2Title.variable,
  era3Title.variable,
  era4Title.variable,
  era5Title.variable,
  era6Title.variable,
  era7Title.variable,
  era8Title.variable,
].join(" ");

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
