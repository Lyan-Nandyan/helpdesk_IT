// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import Keycloak from 'keycloak-js'
import { keycloakConfig } from './keycloakConfig'

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null)
  const [initialized, setInitialized] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [profile, setProfile] = useState(null)
  const [roles, setRoles] = useState([])

  useEffect(() => {
    const kc = new Keycloak({
      url: keycloakConfig.url,
      realm: keycloakConfig.realm,
      clientId: keycloakConfig.clientId,
    })

    kc.init({
      onLoad: 'check-sso',       // app bisa dibuka tanpa dipaksa login dulu
      pkceMethod: 'S256',
      checkLoginIframe: false,   // biar nggak ribet iframe di dev
    })
      .then(async (auth) => {
        setKeycloak(kc)
        setAuthenticated(auth)

        if (auth) {
          try {
            const userProfile = await kc.loadUserProfile()
            setProfile(userProfile)
          } catch (err) {
            console.error('Gagal load profile user:', err)
          }

          const tokenParsed = kc.tokenParsed || {}
          const realmRoles = tokenParsed.realm_access?.roles || []
          setRoles(realmRoles)

          // refresh token sebelum kadaluarsa
          kc.onTokenExpired = () => {
            kc.updateToken(60).catch(() => {
              kc.logout()
            })
          }
        }

        setInitialized(true)
      })
      .catch((err) => {
        console.error('Gagal inisialisasi Keycloak:', err)
        setInitialized(true)
      })
  }, [])

  const login = () => {
    if (!keycloak) return
    keycloak.login()
  }

  const logout = () => {
    if (!keycloak) return
    keycloak.logout({ redirectUri: window.location.origin })
  }

  const hasRole = (role) => roles.includes(role)

  const value = {
    keycloak,
    initialized,
    authenticated,
    profile,
    roles,
    login,
    logout,
    hasRole,
  }

  if (!initialized) {
    return <div>Memeriksa autentikasi...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  }
  return ctx
}

export { AuthProvider, useAuth }