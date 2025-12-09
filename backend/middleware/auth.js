// src/middleware/auth.js
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import {
  keycloakIssuer,
  keycloakAudience,
  keycloakJwksUri,
} from "../config/keycloak.js";

// Constants
const CACHE_MAX_AGE_MS = 600000; // 10 menit
const JWT_ALGORITHM = "RS256";

// JWKS Client dengan caching
const client = jwksClient({
  jwksUri: keycloakJwksUri,
  cache: true,
  cacheMaxAge: CACHE_MAX_AGE_MS,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});

function getKey(header, callback) {
  const kid = header.kid;

  if (!kid) {
    console.error("Token header tidak memiliki kid (key ID)");
    return callback(new Error("Missing kid in token header"));
  }

  client.getSigningKey(kid, (err, key) => {
    if (err) {
      console.error("Error mendapatkan signing key:", err.message);
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("Request tanpa token atau format token salah");
    return res.status(401).json({
      message: "Token tidak ditemukan",
      hint: "Gunakan header: Authorization: Bearer <token>",
    });
  }

  const token = authHeader.substring(7);

  const options = {
    audience: keycloakAudience,
    issuer: keycloakIssuer,
    algorithms: [JWT_ALGORITHM],
  };

  jwt.verify(token, getKey, options, (err, decoded) => {
    if (err) {
      console.error("Error Name:", err.name);
      console.error("Error Message:", err.message);

      if (err.name === "TokenExpiredError") {
        console.error("Token expired at:", err.expiredAt);
        return res.status(401).json({
          message: "Token sudah kadaluarsa",
          error: "TokenExpiredError",
          expiredAt: err.expiredAt,
        });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Token tidak valid",
          error: err.message,
        });
      }

      return res.status(401).json({
        message: "Gagal verifikasi token",
        error: err.message,
      });
    }

    req.user = decoded;
    next();
  });
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      console.warn("Authorize: User tidak terautentikasi");
      return res.status(401).json({ message: "Belum terautentikasi" });
    }

    const userRoles = req.user.realm_access?.roles || [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses ke resource ini",
        requiredRoles: allowedRoles,
        yourRoles: userRoles,
      });
    }

    next();
  };
}
