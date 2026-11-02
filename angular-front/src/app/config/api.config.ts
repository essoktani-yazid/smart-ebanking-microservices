export function getGatewayUrl(): string {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return `http://${window.location.hostname}:9999`;
  }
  return 'http://localhost:9999';
}

