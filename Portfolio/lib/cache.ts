/**
 * Sistema de caché simple para optimizar peticiones al backend
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const CACHE_STORAGE_VERSION = 2;

class CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private inFlight: Map<string, Promise<any>>;
  private defaultTTL: number; // Time To Live en milisegundos
  private storageKey = `portfolio_cache_v${CACHE_STORAGE_VERSION}`;
  private isHydrated = false;
  private persistTimer: ReturnType<typeof setTimeout> | null = null;
  private persistDelay = 500; // ms debounce

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutos por defecto
    this.cache = new Map();
    this.inFlight = new Map();
    this.defaultTTL = defaultTTL;
    this.hydrate();
  }

  /**
   * Carga el caché desde localStorage al inicializar
   */
  private hydrate(): void {
    if (typeof window === 'undefined' || this.isHydrated) return;
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return;
      
      const parsed = JSON.parse(stored) as Record<string, CacheEntry<any>>;
      const now = Date.now();
      
      // Restaurar solo entradas no expiradas
      Object.entries(parsed).forEach(([key, entry]) => {
        if (entry.expiresAt > now) {
          this.cache.set(key, entry);
        }
      });
      
      this.isHydrated = true;
    } catch (error) {
      // Si hay error al parsear, limpiar localStorage
      localStorage.removeItem(this.storageKey);
    }

    // Limpiar caché legacy si existe (cambios de esquema/keys anteriores)
    try {
      localStorage.removeItem('portfolio_cache');
    } catch {
      // ignore
    }
  }

  /**
   * Persiste el caché en localStorage (debounced)
   */
  private persist(): void {
    if (typeof window === 'undefined') return;

    if (this.persistTimer) {
      clearTimeout(this.persistTimer);
    }

    this.persistTimer = setTimeout(() => {
      this.persistNow();
      this.persistTimer = null;
    }, this.persistDelay);
  }

  /**
   * Persiste inmediatamente (usado en beforeunload y flush)
   */
  private persistNow(): void {
    if (typeof window === 'undefined') return;

    try {
      const entries: Record<string, CacheEntry<any>> = {};
      this.cache.forEach((value, key) => {
        entries[key] = value;
      });
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    } catch (error) {
      // Si localStorage está lleno o hay error, limpiar entradas antiguas
      this.cleanup();
    }
  }

  /**
   * Genera una clave única basada en la URL y parámetros
   */
  private generateKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}:${paramString}`;
  }

  /**
   * Guarda datos en el caché
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const expirationTime = ttl || this.defaultTTL;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + expirationTime,
    };
    this.cache.set(key, entry);
    this.persist();
  }

  /**
   * Obtiene datos del caché si existen y no han expirado
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verificar si el caché ha expirado
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.persist();
      return null;
    }

    return entry.data as T;
  }

  /**
   * Verifica si existe un dato en caché y no ha expirado
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Elimina un dato específico del caché
   */
  delete(key: string): boolean {
    const result = this.cache.delete(key);
    if (result) {
      this.persist();
    }
    return result;
  }

  /**
   * Limpia todo el caché
   */
  clear(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  /**
   * Elimina entradas expiradas del caché
   */
  cleanup(): void {
    const now = Date.now();
    let hasChanges = false;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      this.persist();
    }
  }

  /**
   * Obtiene estadísticas del caché
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        timestamp: entry.timestamp,
        expiresIn: Math.max(0, entry.expiresAt - Date.now()),
      })),
    };
  }

  /**
   * Wrapper para peticiones con caché automático
   */
  async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Intentar obtener del caché
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Deduplicar requests concurrentes por key
    const existingInFlight = this.inFlight.get(key) as Promise<T> | undefined;
    if (existingInFlight) {
      return existingInFlight;
    }

    // Si no está en caché, hacer la petición
    const inFlightPromise = (async () => {
      const data = await fetcher();
      this.set(key, data, ttl);
      return data;
    })();

    this.inFlight.set(key, inFlightPromise);

    try {
      return await inFlightPromise;
    } finally {
      this.inFlight.delete(key);
    }
  }
}

// Instancia global del caché
export const cache = new CacheManager();

// Limpiar caché expirado cada 10 minutos (solo en cliente, con cleanup)
let cleanupIntervalId: ReturnType<typeof setInterval> | null = null;
if (typeof window !== 'undefined') {
  cleanupIntervalId = setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
  
  // Flush pendiente + cleanup cuando se cierra la ventana/tab
  window.addEventListener('beforeunload', () => {
    // Persistir datos pendientes del debounce antes de cerrar
    (cache as any).persistNow();
    if (cleanupIntervalId) {
      clearInterval(cleanupIntervalId);
      cleanupIntervalId = null;
    }
  });
}

/**
 * Hook personalizado para usar caché en componentes
 */
export function useCacheKey(baseKey: string, params?: Record<string, any>): string {
  const paramString = params ? JSON.stringify(params) : '';
  return `${baseKey}:${paramString}`;
}

/**
 * Construye una cache key con versión externa (por ejemplo, versión entregada por backend).
 */
export function buildVersionedKey(
  baseKey: string,
  params: Record<string, any> | undefined,
  version: number | string | undefined
): string {
  const suffix = version ? `:v${version}` : '';
  const paramsStr = params ? JSON.stringify(params) : '';
  return `${baseKey}:${paramsStr}${suffix}`;
}

/**
 * Constantes de tiempo de expiración
 */
export const CacheTTL = {
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
} as const;
