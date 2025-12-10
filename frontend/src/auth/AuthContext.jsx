// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import Keycloak from 'keycloak-js'
import { keycloakConfig } from './keycloakConfig'

const AuthContext = createContext(null)

// Constants
const TOKEN_MIN_VALIDITY_SECONDS = 30
const TOKEN_UPDATE_THRESHOLD_SECONDS = 60
const LOADING_MESSAGE = 'Memeriksa autentikasi...'

const AuthProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null)
  const [initialized, setInitialized] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [profile, setProfile] = useState(null)
  const [roles, setRoles] = useState([])

  const getValidToken = useCallback(async () => {
    if (!keycloak) {
      console.warn('Keycloak belum diinisialisasi')
      return null
    }
    
    try {
      const refreshed = await keycloak.updateToken(TOKEN_MIN_VALIDITY_SECONDS)
      if (refreshed) {
        console.log('Token berhasil di-refresh')
      }
      return keycloak.token
    } catch (error) {
      console.error('Gagal refresh token:', error)
      keycloak.logout()
      return null
    }
  }, [keycloak])

  const loadUserProfile = useCallback(async (kc) => {
    try {
      const userProfile = await kc.loadUserProfile()
      setProfile(userProfile)
    } catch (err) {
      console.error('Gagal load profile user:', err)
    }
  }, [])


  const extractRoles = useCallback((kc) => {
    const tokenParsed = kc.tokenParsed || {}
    const realmRoles = tokenParsed.realm_access?.roles || []
    setRoles(realmRoles)
    console.log('User roles:', realmRoles)
  }, [])

  const setupTokenRefresh = useCallback((kc) => {
    kc.onTokenExpired = () => {
      console.log('Token expired, melakukan refresh...')
      kc.updateToken(TOKEN_UPDATE_THRESHOLD_SECONDS)
        .then((refreshed) => {
          if (refreshed) {
            console.log('Token berhasil di-refresh')
          }
        })
        .catch((error) => {
          console.error('Gagal refresh token, logout...', error)
          kc.logout()
        })
    }
  }, [])

  useEffect(() => {
    const kc = new Keycloak({
      url: keycloakConfig.url,
      realm: keycloakConfig.realm,
      clientId: keycloakConfig.clientId,
    })

    kc.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    })
      .then(async (auth) => {
        setKeycloak(kc)
        setAuthenticated(auth)

        if (auth) {
          await loadUserProfile(kc)
          extractRoles(kc)
          setupTokenRefresh(kc)
        }

        setInitialized(true)
      })
      .catch((err) => {
        console.error('Gagal inisialisasi Keycloak:', err)
        setInitialized(true)
      })
  }, [loadUserProfile, extractRoles, setupTokenRefresh])

  const login = useCallback(() => {
    if (!keycloak) return
    keycloak.login()
  }, [keycloak])

  const logout = useCallback(() => {
    if (!keycloak) return
    keycloak.logout({ redirectUri: window.location.origin })
  }, [keycloak])

  const hasRole = useCallback((role) => {
    return roles.includes(role)
  }, [roles])

  const value = {
    keycloak,
    initialized,
    authenticated,
    profile,
    roles,
    login,
    logout,
    hasRole,
    getValidToken,
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