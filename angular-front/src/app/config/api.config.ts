export function getGatewayUrl(): string {
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname;
    // If accessed via Cloudflare tunnel or directly on Angular dev port 4200,
    // use relative path so requests are seamlessly routed via proxy.conf.json to Gateway 9999
    if (host.includes('trycloudflare.com') || window.location.port === '4200') {
      return '';
    }
    return `http://${host}:9999`;
  }
  return '';
}

