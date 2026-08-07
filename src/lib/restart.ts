import { clearProgress } from "@/lib/storage";

/**
 * Recomeçar do zero.
 *
 * O jogo é de propósito uma via de mão única: a sequência final não anda
 * para trás e a tela "Olha para ele." não tem botão nenhum. Isso protege
 * a noite, mas deixa quem precisa **testar** sem saída — em produção não
 * há painel de dev para limpar o progresso.
 *
 * Daí os dois caminhos abaixo. Nenhum deles aparece na interface, e nem
 * um nem outro pode ser alcançado por engano durante a experiência.
 */

/** Abrir a página com `?reiniciar` apaga o progresso e começa de novo. */
export const RESTART_TOKEN = "reiniciar";

/**
 * Consome o pedido de reinício vindo da URL, se houver.
 *
 * Aceita `?reiniciar` e `#reiniciar` — o hash existe porque é o que
 * sobrevive a alguns leitores de QR code e apps de mensagem, que reescrevem
 * a query string. O token é removido da barra de endereço logo depois, para
 * que um F5 seguinte não apague o progresso outra vez.
 *
 * Retorna `true` quando o progresso foi apagado.
 */
export function consumeRestartRequest(): boolean {
  if (typeof window === "undefined") return false;

  const url = new URL(window.location.href);
  const naQuery = url.searchParams.has(RESTART_TOKEN);
  const noHash = url.hash.replace(/^#/, "") === RESTART_TOKEN;
  if (!naQuery && !noHash) return false;

  clearProgress();

  url.searchParams.delete(RESTART_TOKEN);
  if (noHash) url.hash = "";
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);

  return true;
}
