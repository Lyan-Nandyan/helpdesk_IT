// src/config/keycloak.js
import 'dotenv/config'

export const keycloakIssuer = process.env.KEYCLOAK_ISSUER
export const keycloakAudience = process.env.KEYCLOAK_AUDIENCE
export const keycloakJwksUri = process.env.KEYCLOAK_JWKS_URI

if (!keycloakIssuer || !keycloakAudience || !keycloakJwksUri) {
  console.error('Konfigurasi Keycloak di .env belum lengkap')
  process.exit(1)
}
