"use client";

import type { InventoryGlyph as GlyphKind } from "@/types/game";

/**
 * Os desenhos dos itens do inventário.
 *
 * São SVG traçados à mão em vez de emoji porque o roteiro só autoriza
 * dois emojis no projeto inteiro (🏆 e 🖕) — e porque um contorno fino,
 * na cor da Era, parece um item catalogado por um sistema. Um emoji
 * pareceria um adesivo.
 *
 * O FIO INVISÍVEL não tem desenho de propósito: o sistema alega não
 * conseguir exibi-lo, e a moldura vazia é a piada.
 */
export function InventoryGlyph({
  kind,
  size = 28,
}: {
  kind: GlyphKind;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (kind) {
    case "bracelet":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7.5" strokeDasharray="1.6 2.2" />
          <circle cx="12" cy="4.5" r="1.4" />
        </svg>
      );

    case "remote":
      return (
        <svg {...common}>
          <rect x="8" y="2.5" width="8" height="19" rx="2.5" />
          <circle cx="12" cy="7" r="1.2" />
          <path d="M10 11h4M10 14h4M10 17h4" />
        </svg>
      );

    case "leaf":
      return (
        <svg {...common}>
          <path d="M19 5c0 7-5 12-11 12-1.5 0-2.5-.3-3-.6C5 10 10 5 19 5Z" />
          <path d="M5 19c2-4 5-7 9-9" />
        </svg>
      );

    case "pizza":
      return (
        <svg {...common}>
          <path d="M12 3 4 19c5 2.5 11 2.5 16 0L12 3Z" />
          <circle cx="10" cy="13" r="1" />
          <circle cx="14" cy="15" r="1" />
          <circle cx="12" cy="9" r="1" />
        </svg>
      );

    case "stone":
      return (
        <svg {...common}>
          <path d="M5 15c-1-4 2-8 6-8 5 0 8 3 8 7 0 3-3 5-7 5s-6-1-7-4Z" />
          <path d="M9 12c1.5-1 3-1.2 4.5-.5" />
        </svg>
      );

    case "map":
      return (
        <svg {...common}>
          <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20V6.5Z" />
          <path d="M9 4v13.5M15 6.5V20" />
        </svg>
      );

    case "milk":
      return (
        <svg {...common}>
          <path d="M8 9h8v11a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 20V9Z" />
          <path d="M9 9V4.5l3-2 3 2V9" />
          <path d="M8 14h8" />
        </svg>
      );

    case "scarf":
      return (
        <svg {...common}>
          <path d="M6 3.5h12v6a6 6 0 0 1-6 6 6 6 0 0 1-6-6v-6Z" />
          <path d="M9 3.5v6M15 3.5v6" />
          <path d="M10 15.5v5M14 15.5v5" />
        </svg>
      );

    case "clipping":
      return (
        <svg {...common}>
          <path d="M4 4.5h16v15H6a2 2 0 0 1-2-2v-13Z" />
          <path d="M7 8h6M7 11h10M7 14h10M7 17h7" />
        </svg>
      );

    case "ring":
      return (
        <svg {...common}>
          <circle cx="12" cy="14.5" r="5.5" />
          <path d="m9 8.5 3-4.5 3 4.5" />
        </svg>
      );

    case "string":
      // Sem traçado: o item existe, o desenho não.
      return (
        <svg {...common}>
          <rect
            x="3.5"
            y="3.5"
            width="17"
            height="17"
            rx="2"
            strokeDasharray="2 3"
            opacity="0.55"
          />
        </svg>
      );

    default:
      return null;
  }
}
