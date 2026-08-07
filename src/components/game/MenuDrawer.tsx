"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InventoryGlyph } from "@/components/game/InventoryGlyph";
import { SoundToggle } from "@/components/game/SoundToggle";
import { useEraTheme } from "@/components/game/EraThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatElapsed } from "@/hooks/useSessionStats";
import { projectConfig } from "@/config/project";
import {
  emptyInventoryNote,
  getInventoryItem,
  inventoryFooterNote,
} from "@/content/inventory";
import {
  emptyFilesNote,
  filesFooterNote,
  permanentlyLockedFileId,
  secretFiles,
} from "@/content/secret-files";
import { playEffect } from "@/lib/audio";
import type { GameProgress } from "@/types/game";

/**
 * O menu.
 *
 * Deixou de ser uma gaveta com um contador escondido e virou o painel dos
 * sistemas paralelos: paciência, inventário, arquivos e estatísticas. A
 * intenção é que abrir o menu seja uma recompensa — quatro abas de coisas
 * que o sistema coletou sem avisar, nenhuma delas útil, todas com opinião.
 *
 * Nada aqui altera o jogo. É tudo leitura, e é de propósito: o jogador
 * precisa poder xeretar sem medo de estragar nada.
 */

type Tab = "paciencia" | "inventario" | "arquivos" | "estatisticas";

const TABS: { id: Tab; label: string }[] = [
  { id: "paciencia", label: "PACIÊNCIA" },
  { id: "inventario", label: "ITENS" },
  { id: "arquivos", label: "ARQUIVOS" },
  { id: "estatisticas", label: "DADOS" },
];

export function MenuDrawer({
  progress,
  sessionStats,
  onOpenCountChange,
  onLogoTap,
  onWatchingChange,
  systemLabel,
}: {
  progress: GameProgress;
  sessionStats: { taps: number; elapsedMs: number };
  onOpenCountChange: (count: number) => void;
  onLogoTap: () => void;
  /** Avisa o contador de sessão que alguém está lendo os números. */
  onWatchingChange: (watching: boolean) => void;
  /** Linha de status da Era atual, exibida ao lado do logotipo. */
  systemLabel: string;
}) {
  const theme = useEraTheme();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("paciencia");
  const [opens, setOpens] = useState(0);
  const [brokenMessage, setBrokenMessage] = useState(false);

  const patienceBroken = progress.fakeResetStage === "revealed";

  useEffect(() => {
    onWatchingChange(open && tab === "estatisticas");
  }, [open, tab, onWatchingChange]);

  function toggle() {
    playEffect("tap");
    const next = !open;
    setOpen(next);
    if (next) {
      const count = opens + 1;
      setOpens(count);
      onOpenCountChange(count);
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-2 px-4 pt-2">
        {/* O logotipo não leva a lugar nenhum: é o alvo dos treze toques. */}
        <button
          type="button"
          onClick={onLogoTap}
          aria-label={projectConfig.projectName}
          className="min-h-11 shrink-0 font-mono text-[10px] tracking-[0.3em] opacity-40 focus-visible:outline focus-visible:outline-2"
        >
          P:NE
        </button>

        {/*
          A linha de status muda a cada Era. É o sinal mais barato e mais
          constante de que o sistema não é o mesmo de dez minutos atrás.
        */}
        <motion.p
          key={systemLabel}
          initial={reducedMotion ? false : { opacity: 0, y: -3 }}
          animate={{ opacity: 0.45, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-w-0 flex-1 truncate text-center font-mono text-[9px] tracking-[0.18em]"
        >
          {systemLabel}
        </motion.p>

        <div className="flex shrink-0 items-center gap-1">
          <SoundToggle />
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="flex min-h-11 min-w-11 items-center justify-center text-lg opacity-50 transition-opacity hover:opacity-90 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2"
            style={{ color: theme.foreground }}
          >
            <span aria-hidden>{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            /*
              Acima da fila de notificações (z-60). Abrir o menu é uma
              ação deliberada do jogador; as notificações chegam sozinhas.
              Quando as duas coincidem, quem mandou abrir ganha — do
              contrário um aviso ambiente cobre justo a linha de abas.
            */
            className="absolute right-4 top-full z-[70] w-72 overflow-hidden"
            style={{
              backgroundColor: `${theme.background}f7`,
              border: `1px solid ${theme.foreground}33`,
              borderRadius: theme.radius,
            }}
          >
            <div
              className="flex"
              style={{ borderBottom: `1px solid ${theme.foreground}22` }}
            >
              {TABS.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => {
                    playEffect("tap");
                    setTab(entry.id);
                  }}
                  aria-pressed={tab === entry.id}
                  className="min-h-11 flex-1 px-1 py-2 font-mono text-[9px] tracking-[0.12em] transition-opacity focus-visible:outline focus-visible:outline-2"
                  style={{
                    opacity: tab === entry.id ? 1 : 0.42,
                    color: tab === entry.id ? theme.accent : theme.foreground,
                  }}
                >
                  {entry.label}
                </button>
              ))}
            </div>

            <div className="max-h-72 overflow-y-auto p-4">
              {tab === "paciencia" ? (
                <PatiencePanel
                  patience={progress.patience}
                  broken={patienceBroken}
                  brokenMessage={brokenMessage}
                  onBrokenTap={() => setBrokenMessage(true)}
                />
              ) : null}

              {tab === "inventario" ? (
                <InventoryPanel inventory={progress.inventory} />
              ) : null}

              {tab === "arquivos" ? <FilesPanel files={progress.files} /> : null}

              {tab === "estatisticas" ? (
                <StatsPanel progress={progress} session={sessionStats} />
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PatiencePanel({
  patience,
  broken,
  brokenMessage,
  onBrokenTap,
}: {
  patience: number;
  broken: boolean;
  brokenMessage: boolean;
  onBrokenTap: () => void;
}) {
  const theme = useEraTheme();
  const filled = Math.max(0, Math.round((patience / 100) * 12));

  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.2em] opacity-60">
        PACIÊNCIA DE CACAU
      </p>

      {broken ? (
        <button
          type="button"
          onClick={onBrokenTap}
          className="mt-2 min-h-11 w-full text-left font-mono text-sm tracking-widest"
          style={{ color: theme.accent }}
        >
          ERRO
        </button>
      ) : (
        <>
          <p
            className="mt-2 font-mono text-sm tracking-tight"
            style={{ color: theme.accent }}
            aria-hidden
          >
            {"█".repeat(filled)}
            {"░".repeat(12 - filled)}
          </p>
          <p className="mt-1 font-mono text-sm tabular-nums">{patience}%</p>
        </>
      )}

      {brokenMessage ? (
        <p className="mt-2 text-xs leading-relaxed opacity-80">
          Valor abaixo
          <br />
          do limite mensurável.
        </p>
      ) : null}
    </div>
  );
}

function InventoryPanel({ inventory }: { inventory: string[] }) {
  const theme = useEraTheme();

  if (inventory.length === 0) {
    return (
      <p className="whitespace-pre-line font-mono text-[11px] leading-relaxed opacity-60">
        {emptyInventoryNote}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {inventory.map((id) => {
        const item = getInventoryItem(id);
        if (!item) return null;
        return (
          <div key={id} className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0" style={{ color: theme.accent }}>
              <InventoryGlyph kind={item.glyph} size={24} />
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[10px] leading-snug tracking-[0.12em]">
                {item.name}
              </span>
              <span className="mt-0.5 block text-[11px] leading-relaxed opacity-60">
                {item.note}
              </span>
            </span>
          </div>
        );
      })}
      <p
        className="border-t pt-2 font-mono text-[9px] tracking-[0.14em] opacity-50"
        style={{ borderColor: `${theme.foreground}22` }}
      >
        {inventoryFooterNote}
      </p>
    </div>
  );
}

/**
 * A lista de arquivos mostra **todos** os códigos, inclusive os que ele
 * nunca vai abrir. Ver "ARQUIVO 013 — ACESSO NEGADO" desde cedo é o que
 * transforma a coleção em curiosidade em vez de checklist.
 */
function FilesPanel({ files }: { files: string[] }) {
  const theme = useEraTheme();

  return (
    <div className="flex flex-col gap-2.5">
      {files.length === 0 ? (
        <p className="whitespace-pre-line font-mono text-[11px] leading-relaxed opacity-60">
          {emptyFilesNote}
        </p>
      ) : null}

      {secretFiles.map((file) => {
        const found = files.includes(file.id);
        const locked = file.id === permanentlyLockedFileId;
        return (
          <div key={file.id} className="flex items-baseline gap-2">
            <span
              className="shrink-0 font-mono text-[10px] tracking-[0.1em]"
              style={{ color: found ? theme.accent : theme.foreground, opacity: found ? 1 : 0.35 }}
            >
              {file.code}
            </span>
            <span
              className="min-w-0 flex-1 truncate font-mono text-[10px]"
              style={{ opacity: found ? 0.85 : 0.3 }}
            >
              {found ? file.name : locked ? "ACESSO NEGADO" : "NÃO LOCALIZADO"}
            </span>
          </div>
        );
      })}

      <p
        className="border-t pt-2 font-mono text-[9px] leading-relaxed tracking-[0.1em] opacity-50"
        style={{ borderColor: `${theme.foreground}22` }}
      >
        {filesFooterNote(files.length)}
      </p>
    </div>
  );
}

function StatsPanel({
  progress,
  session,
}: {
  progress: GameProgress;
  session: { taps: number; elapsedMs: number };
}) {
  const theme = useEraTheme();

  const rows: [string, string][] = [
    ["Tempo desta sessão", formatElapsed(session.elapsedMs)],
    ["Toques registrados", String(session.taps)],
    ["Perguntas respondidas", String(progress.stats.answers)],
    ["Falhas presenciadas", String(progress.stats.errors)],
    ["Fugas do botão “Não”", String(progress.noButtonAttempts)],
    ["Acessos negados", String(progress.eraXiiiTapCount)],
    ["Conquistas", String(progress.achievements.length)],
    ["Easter Eggs", String(progress.easterEggs.length)],
    ["Itens", String(progress.inventory.length)],
    ["Arquivos", String(progress.files.length)],
    // As duas últimas são a piada do painel inteiro.
    ["Mentiras contadas", "0"],
    ["Precisão do progresso", "N/D"],
  ];

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline justify-between gap-3">
          <span className="text-[11px] leading-snug opacity-65">{label}</span>
          <span
            className="shrink-0 font-mono text-[11px] tabular-nums"
            style={{ color: theme.accent }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
