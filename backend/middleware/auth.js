// src/middleware/auth.js
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { keycloakIssuer, keycloakAudience, keycloakJwksUri } from '../config/keycloak.js'

const client = jwksClient({
  jwksUri: keycloakJwksUri,
})

// ambil public key dari kid di header token
function getKey(header, callback) {
  const kid = header.kid
  client.getSigningKey(kid, (err, key) => {
    if (err) {
      return callback(err)
    }
    const signingKey = key.getPublicKey()
    callback(null, signingKey)
  })
}

// middleware autentikasi
export function authenticate(req, res, next) {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' })
  }

  const token = authHeader.substring(7) // hapus "Bearer "

  const options = {
    audience: keycloakAudience,
    issuer: keycloakIssuer,
    algorithms: ['RS256'],
  }

  jwt.verify(token, getKey, options, (err, decoded) => {
    if (err) {
      console.error('Gagal verifikasi token:', err.message)
      return res.status(401).json({ message: 'Token tidak valid' })
    }

    req.user = decoded
    // misal: req.user.preferred_username, req.user.realm_access.roles, dll
    next()
  })
}

// middleware otorisasi berdasarkan role
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Belum terautentikasi' })
    }

    const userRoles = req.user.realm_access?.roles || []

    const hasRole = allowedRoles.some((role) => userRoles.includes(role))

    if (!hasRole) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke resource ini' })
    }

    next()
  }
}
