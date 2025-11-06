# Guía de Migración al Sistema de Grid

## 🎯 Objetivo

Migrar de `page.tsx` (sistema manual) a `page-new.tsx` (sistema de grid automático).

## 📋 Pasos de Migración

### 1. Backup del Archivo Actual

```bash
# Desde /main
cp app/page.tsx app/page-old.tsx
```

### 2. Reemplazar con el Nuevo Sistema

```bash
# Desde /main
cp app/page-new.tsx app/page.tsx
```

### 3. Verificar Funcionamiento

```bash
npm run dev
```

Visita `http://localhost:3001` y verifica:
- ✅ Los paneles se organizan automáticamente
- ✅ El responsive funciona (prueba redimensionar ventana)
- ✅ Los paneles son draggables
- ✅ El contenido es scrollable
- ✅ Los botones de menú y ajustes funcionan

### 4. Personalizar (Opcional)

#### Cambiar Layout Predefinido

En `page.tsx`, línea ~75:

```typescript
// Cambiar de 'default' a 'minimal' o 'showcase'
preferredPosition: PRESET_LAYOUTS.minimal.find(preset => preset.id === p.id)?.preferredPosition
```

#### Ajustar Tamaños de Paneles

En `page.tsx`, línea ~27:

```typescript
const [panels, setPanels] = useState<Panel[]>([
  { id: 'vision', name: 'Visión', isOpen: true, size: '2x2', priority: 10 }, // Cambiar a 2x2
  // ...
]);
```

#### Modificar Configuración de Grid

En `lib/gridSystem.ts`, función `getGridConfig()`:

```typescript
// Desktop
return {
  columns: 5,  // Cambiar de 4 a 5 columnas
  rows: 4,     // Cambiar de 3 a 4 filas
  gap: 20,     // Aumentar gap
  padding: { top: 140, right: 40, bottom: 40, left: 40 }
};
```

## 🔧 Solución de Problemas

### Los paneles no se muestran

**Causa**: `windowSize` aún no está inicializado

**Solución**: Ya está manejado con el check `if (windowSize.width === 0) return;`

### Los paneles se superponen

**Causa**: Posiciones preferidas en conflicto

**Solución**: Eliminar `preferredPosition` y dejar que el sistema calcule automáticamente:

```typescript
const layout = openPanels.map(p => ({
  id: p.id,
  size: p.size,
  priority: p.priority,
  // preferredPosition: undefined  // Dejar sin especificar
}));
```

### El responsive no funciona

**Causa**: El listener de resize no está activo

**Solución**: Verificar que el useEffect esté presente:

```typescript
useEffect(() => {
  const updateSize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };
  
  updateSize();
  window.addEventListener('resize', updateSize);
  return () => window.removeEventListener('resize', updateSize);
}, []);
```

### Los paneles son muy pequeños en mobile

**Causa**: Configuración de grid muy ajustada

**Solución**: Ajustar padding y gap en `getGridConfig()` para mobile:

```typescript
if (width < 640) {
  return {
    columns: 2,
    rows: 4,
    gap: 12,  // Aumentar de 8 a 12
    padding: { top: 100, right: 20, bottom: 20, left: 20 }  // Aumentar padding
  };
}
```

## 📊 Comparación

### Antes (Sistema Manual)

```typescript
<InfoPanel 
  position="right-wide"
  offsetY={220}
  offsetX={270}
/>
```

**Problemas**:
- Posiciones hardcodeadas
- No responsive
- Difícil de mantener
- Colisiones manuales

### Después (Sistema Grid)

```typescript
<InfoPanel 
  gridPosition={gridPositions.get('vision')}
/>
```

**Ventajas**:
- Posicionamiento automático
- Totalmente responsive
- Fácil de mantener
- Sin colisiones

## 🎨 Personalización Avanzada

### Crear un Nuevo Layout Preset

En `lib/gridSystem.ts`:

```typescript
export const PRESET_LAYOUTS = {
  // ... layouts existentes
  
  custom: [
    { id: 'hero', size: '2x2', priority: 10, preferredPosition: { col: 1, row: 0 } },
    { id: 'sidebar', size: '1x2', priority: 9, preferredPosition: { col: 0, row: 0 } },
    { id: 'footer', size: '2x1', priority: 8, preferredPosition: { col: 1, row: 2 } },
  ]
};
```

### Agregar Animaciones de Reorganización

En `page.tsx`, en el InfoPanel:

```typescript
<motion.div
  layout  // Agregar esta prop
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
>
  {/* Contenido del panel */}
</motion.div>
```

### Persistir Posiciones en localStorage

```typescript
// Guardar
useEffect(() => {
  localStorage.setItem('panelStates', JSON.stringify(panels));
}, [panels]);

// Cargar
useEffect(() => {
  const saved = localStorage.getItem('panelStates');
  if (saved) {
    setPanels(JSON.parse(saved));
  }
}, []);
```

## ✅ Checklist de Migración

- [ ] Backup del archivo original
- [ ] Copiar page-new.tsx a page.tsx
- [ ] Verificar que compile sin errores
- [ ] Probar en desktop (≥1024px)
- [ ] Probar en tablet (640-1023px)
- [ ] Probar en mobile (<640px)
- [ ] Verificar drag & drop
- [ ] Verificar scroll en paneles
- [ ] Verificar botones de menú y ajustes
- [ ] Personalizar según necesidades
- [ ] Eliminar page-old.tsx si todo funciona

## 🚀 Próximos Pasos

1. **Optimización**: Memoizar cálculos con `useMemo`
2. **Animaciones**: Agregar transiciones suaves
3. **Persistencia**: Guardar estado en localStorage
4. **Temas**: Crear más layouts predefinidos
5. **Resize**: Permitir cambiar tamaño de paneles

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador
2. Verifica que todos los imports estén correctos
3. Asegúrate de que `lib/gridSystem.ts` existe
4. Revisa que InfoPanel tenga el prop `gridPosition`

---

**Nota**: El sistema mantiene compatibilidad con el código anterior, por lo que puedes migrar gradualmente panel por panel si lo prefieres.
