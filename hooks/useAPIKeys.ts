'use client'

import { useState, useEffect, useCallback } from 'react'
import { AIProvider, StoredAPIKeys } from '@/types'

const STORAGE_KEY = 'ias-unidas-api-keys'

const defaultKeys: StoredAPIKeys = {
  claude: '',
  gemini: '',
  kimi: '',
}

export function useAPIKeys() {
  const [keys, setKeys] = useState<StoredAPIKeys>(defaultKeys)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setKeys({ ...defaultKeys, ...JSON.parse(stored) })
      }
    } catch {
      // localStorage indisponível (SSR ou bloqueado)
    }
    setLoaded(true)
  }, [])

  const setKey = useCallback((provider: AIProvider, key: string) => {
    setKeys((prev) => {
      const next = { ...prev, [provider]: key }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const clearKey = useCallback(
    (provider: AIProvider) => {
      setKey(provider, '')
    },
    [setKey]
  )

  const hasKey = useCallback(
    (provider: AIProvider) => {
      return keys[provider].trim().length > 0
    },
    [keys]
  )

  const getActiveKeys = useCallback(
    (providers: AIProvider[]) => {
      return providers.filter((p) => hasKey(p))
    },
    [hasKey]
  )

  return { keys, setKey, clearKey, hasKey, getActiveKeys, loaded }
}
