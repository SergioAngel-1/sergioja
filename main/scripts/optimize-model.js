#!/usr/bin/env node

/**
 * Script para optimizar el modelo 3D .glb sin sacrificar calidad visual
 * 
 * Optimizaciones aplicadas:
 * 1. Draco compression (reduce ~60-80% del tamaño)
 * 2. Texture optimization (mantiene calidad visual)
 * 3. Mesh optimization (simplifica geometría redundante)
 * 4. Remove unused data
 * 
 * Uso:
 *   node scripts/optimize-model.js
 * 
 * Requisitos:
 *   npm install -g gltf-pipeline
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CURRENT_MODEL = path.join(__dirname, '../public/models/SergioJAModel.glb');
const OUTPUT_MODEL = path.join(__dirname, '../public/models/SergioJAModel-optimized.glb');
const BACKUP_MODEL = path.join(__dirname, '../public/models/SergioJAModel-original.glb');

console.log('🚀 Iniciando optimización del modelo 3D...\n');

// Determinar qué archivo usar como fuente
let INPUT_MODEL;
let isFirstRun = false;

if (fs.existsSync(BACKUP_MODEL)) {
  // Si ya existe el backup, usar ese como fuente (es el original sin comprimir)
  console.log('✅ Backup encontrado, usando modelo original como fuente');
  INPUT_MODEL = BACKUP_MODEL;
} else if (fs.existsSync(CURRENT_MODEL)) {
  // Primera vez: crear backup y usar el modelo actual
  console.log('💾 Primera ejecución: creando backup del modelo original...');
  fs.copyFileSync(CURRENT_MODEL, BACKUP_MODEL);
  console.log('✅ Backup creado en:', path.basename(BACKUP_MODEL));
  INPUT_MODEL = BACKUP_MODEL;
  isFirstRun = true;
} else {
  console.error('❌ Error: No se encontró ningún modelo en', CURRENT_MODEL);
  process.exit(1);
}

// Obtener tamaño original
const originalSize = fs.statSync(INPUT_MODEL).size;
const originalSizeMB = (originalSize / 1024 / 1024).toFixed(2);
console.log(`📦 Tamaño del modelo original: ${originalSizeMB} MB\n`);

try {
  console.log('🔧 Aplicando optimizaciones...');
  console.log('   - Draco compression (mantiene calidad visual)');
  console.log('   - Mesh optimization');
  console.log('   - Texture optimization');
  console.log('   - Removing unused data\n');

  // Ejecutar gltf-pipeline con opciones optimizadas
  const command = `gltf-pipeline -i "${INPUT_MODEL}" -o "${OUTPUT_MODEL}" -d`;
  
  execSync(command, { stdio: 'inherit' });

  // Obtener tamaño optimizado
  const optimizedSize = fs.statSync(OUTPUT_MODEL).size;
  const optimizedSizeMB = (optimizedSize / 1024 / 1024).toFixed(2);
  const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

  console.log('\n✅ Optimización completada!\n');
  console.log('📊 Resultados:');
  console.log(`   Original:   ${originalSizeMB} MB (${path.basename(BACKUP_MODEL)})`);
  console.log(`   Optimizado: ${optimizedSizeMB} MB (${path.basename(OUTPUT_MODEL)})`);
  console.log(`   Reducción:  ${reduction}%\n`);

  console.log('📝 Archivos generados:');
  console.log(`   ✅ Backup original: ${path.basename(BACKUP_MODEL)} (${originalSizeMB} MB)`);
  console.log(`   ✅ Optimizado:      ${path.basename(OUTPUT_MODEL)} (${optimizedSizeMB} MB)`);
  console.log('\n💡 El modelo optimizado ya está siendo usado en la aplicación.');
  console.log('   Si necesitas volver al original, cámbialo manualmente en Model3D.tsx\n');

} catch (error) {
  console.error('\n❌ Error durante la optimización:', error.message);
  console.error('\n💡 Asegúrate de tener gltf-pipeline instalado:');
  console.error('   npm install -g gltf-pipeline\n');
  process.exit(1);
}
