import type { ReactNode } from "react";

/**
 * Casco fixo do app: ocupa a viewport inteira, respeita as áreas seguras
 * do iPhone e centraliza o conteúdo em uma coluna mobile-first.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="safe-area-shell flex min-h-dvh w-full justify-center">
      <div className="flex w-full max-w-md flex-col">{children}</div>
    </div>
  );
}
