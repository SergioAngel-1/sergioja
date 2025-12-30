/**
 * Meta Description Validator - Development Tool
 * Script para validar todas las meta descriptions del proyecto
 */

import { validateDescription, META_DESCRIPTION_LIMITS } from './metadata';

interface DescriptionCheck {
  location: string;
  description: string;
  validation: ReturnType<typeof validateDescription>;
}

/**
 * Valida múltiples descripciones y retorna reporte
 */
export function validateDescriptions(descriptions: Record<string, string>): {
  results: DescriptionCheck[];
  summary: {
    total: number;
    valid: number;
    tooShort: number;
    tooLong: number;
  };
} {
  const results: DescriptionCheck[] = [];
  
  for (const [location, description] of Object.entries(descriptions)) {
    const validation = validateDescription(description);
    results.push({
      location,
      description,
      validation,
    });
  }
  
  const summary = {
    total: results.length,
    valid: results.filter(r => r.validation.isValid).length,
    tooShort: results.filter(r => r.validation.status === 'too-short').length,
    tooLong: results.filter(r => r.validation.status === 'too-long').length,
  };
  
  return { results, summary };
}

/**
 * Imprime reporte de validación en consola
 */
export function printValidationReport(results: DescriptionCheck[]): void {
  console.log('\n📊 Meta Description Validation Report\n');
  console.log(`Optimal length: ${META_DESCRIPTION_LIMITS.OPTIMAL_MIN}-${META_DESCRIPTION_LIMITS.OPTIMAL_MAX} chars`);
  console.log(`Acceptable range: ${META_DESCRIPTION_LIMITS.MIN}-${META_DESCRIPTION_LIMITS.MAX} chars\n`);
  
  for (const result of results) {
    const icon = result.validation.isValid ? '✅' : '⚠️';
    const statusColor = result.validation.status === 'optimal' ? '\x1b[32m' : 
                       result.validation.status === 'too-short' ? '\x1b[33m' : '\x1b[31m';
    const reset = '\x1b[0m';
    
    console.log(`${icon} ${result.location}`);
    console.log(`   ${statusColor}${result.validation.length} chars${reset} - ${result.validation.status}`);
    console.log(`   "${result.description.substring(0, 80)}${result.description.length > 80 ? '...' : ''}"`);
    
    if (!result.validation.isValid) {
      console.log(`   ${result.validation.message}`);
    }
    console.log('');
  }
}

/**
 * Ejemplo de uso para validar descripciones del proyecto
 */
export function validateProjectDescriptions(): void {
  const descriptions = {
    'Main Site': 'Desarrollador Full Stack especializado en React, Next.js, Node.js y TypeScript. Creando experiencias web modernas y escalables.',
    'Portfolio Site': 'Portfolio profesional de Sergio Jáuregui. Explora mis proyectos, habilidades técnicas y experiencia en desarrollo Full Stack.',
  };
  
  const { results, summary } = validateDescriptions(descriptions);
  
  printValidationReport(results);
  
  console.log('📈 Summary:');
  console.log(`   Total: ${summary.total}`);
  console.log(`   ✅ Valid: ${summary.valid}`);
  console.log(`   ⚠️  Too short: ${summary.tooShort}`);
  console.log(`   ⚠️  Too long: ${summary.tooLong}\n`);
  
  if (summary.valid === summary.total) {
    console.log('🎉 All descriptions are optimal!\n');
  } else {
    console.log('⚠️  Some descriptions need attention.\n');
  }
}
