import { appConfig } from '../config/env';
import { logger } from '../lib/logger';
import jwt from 'jsonwebtoken';

interface RecaptchaAssessmentResponse {
  tokenProperties?: {
    valid: boolean;
    invalidReason?: string;
    action?: string;
    hostname?: string;
    createTime?: string;
  };
  riskAnalysis?: {
    score: number; // 0.0 - 1.0
    reasons?: string[];
  };
  name?: string;
}

// Cache para el access token de Google
let cachedAccessToken: { token: string; expiresAt: number } | null = null;

async function getGoogleAccessToken(): Promise<string | null> {
  // Si hay token en caché y no ha expirado, usarlo
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  const { serviceAccountKey } = appConfig.recaptcha;
  
  if (!serviceAccountKey) {
    logger.warn('No service account key configured for reCAPTCHA Enterprise');
    return null;
  }

  try {
    // Parse service account JSON
    const credentials = JSON.parse(serviceAccountKey);
    
    // Create JWT for Google OAuth
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    // Crear JWT con jsonwebtoken
    const assertion = jwt.sign(payload, credentials.private_key, {
      algorithm: 'RS256',
      header,
    });

    // Exchange JWT for access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error('Failed to get Google access token', { error });
      return null;
    }

    const data = await response.json() as { access_token: string; expires_in: number };
    
    // Cachear el token (expira en 1 hora, renovar 5 min antes)
    cachedAccessToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 300) * 1000,
    };

    return data.access_token;
  } catch (error) {
    logger.error('Error getting Google access token', error);
    return null;
  }
}

export async function verifyRecaptchaEnterprise(
  token: string,
  expectedAction = 'submit_contact'
): Promise<{ valid: boolean; score: number; reasons?: string[]; action?: string }> {
  const { projectId, serviceAccountKey, siteKey, minScore } = appConfig.recaptcha;

  if (!projectId || !siteKey) {
    logger.warn('reCAPTCHA Enterprise not fully configured. Skipping verification.');
    return { valid: true, score: 1 };
  }

  if (!token) {
    return { valid: false, score: 0 };
  }

  if (!serviceAccountKey) {
    logger.error('Service Account not configured for reCAPTCHA Enterprise');
    return { valid: false, score: 0 };
  }

  // Obtener access token usando Service Account
  const accessToken = await getGoogleAccessToken();
  
  if (!accessToken) {
    logger.error('Failed to authenticate with Google Cloud using Service Account');
    return { valid: false, score: 0 };
  }

  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments`;
  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };

  const body = {
    event: {
      token,
      expectedAction,
      siteKey,
    },
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      logger.error('reCAPTCHA Enterprise HTTP error', { status: res.status, body: text });
      return { valid: false, score: 0 };
    }

    const data = (await res.json()) as RecaptchaAssessmentResponse;

    const valid = data.tokenProperties?.valid === true;
    const action = data.tokenProperties?.action;
    const score = data.riskAnalysis?.score ?? 0;

    if (!valid) {
      return { valid: false, score, reasons: data.riskAnalysis?.reasons, action };
    }

    if (expectedAction && action && action !== expectedAction) {
      logger.warn('reCAPTCHA action mismatch', { expectedAction, action });
      return { valid: false, score, reasons: ['ACTION_MISMATCH'], action };
    }

    if (score < (minScore ?? 0.5)) {
      return { valid: false, score, reasons: data.riskAnalysis?.reasons, action };
    }

    return { valid: true, score, reasons: data.riskAnalysis?.reasons, action };
  } catch (error) {
    logger.error('reCAPTCHA Enterprise verification failed', error);
    return { valid: false, score: 0 };
  }
}
