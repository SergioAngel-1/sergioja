import { appConfig } from '../config/env';
import { logger } from '../lib/logger';

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

export async function verifyRecaptchaEnterprise(
  token: string,
  expectedAction = 'submit_contact'
): Promise<{ valid: boolean; score: number; reasons?: string[]; action?: string }> {
  const { projectId, apiKey, siteKey, minScore, bypassDev } = appConfig.recaptcha;

  if (bypassDev && process.env.NODE_ENV !== 'production') {
    return { valid: true, score: 1 };
  }

  if (!projectId || !apiKey || !siteKey) {
    logger.warn('reCAPTCHA Enterprise not fully configured. Skipping verification.');
    return { valid: true, score: 1 };
  }

  if (!token) {
    return { valid: false, score: 0 };
  }

  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;
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
      headers: { 'Content-Type': 'application/json' },
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
