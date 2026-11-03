/**
 * Configuration de l'URL Gateway.
 * En retournant une chaîne vide "", toutes les requêtes (/CUSTOMER-SERVICE, /EBANK-SERVICE, /EBANK-BOT)
 * sont relatives à l'origine courante et traversent le reverse-proxy Angular (proxy.conf.json) vers le Gateway.
 * Cela garantit un fonctionnement 100% universel (Localhost, IP publique, Tunnel Cloudflare) sans blocage de ports ni problème CORS.
 */
export function getGatewayUrl(): string {
  return '';
}
