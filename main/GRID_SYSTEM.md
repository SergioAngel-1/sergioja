# Sistema de Grid Inteligente

Sistema automático de posicionamiento de paneles con soporte responsive completo.

## 🎯 Características

- **Posicionamiento automático**: Los paneles se organizan automáticamente en una cuadrícula
- **Responsive**: Se adapta a diferentes tamaños de pantalla (mobile, tablet, desktop)
- **Tamaños flexibles**: Soporta paneles de 1x1, 1x2, 2x1 y 2x2
- **Prioridades**: Los paneles con mayor prioridad se colocan primero
- **Posiciones preferidas**: Opción de sugerir posiciones específicas
- **Draggable**: Los paneles siguen siendo arrastrables después del posicionamiento
- **Sin colisiones**: El sistema evita superposiciones automáticamente

## 📐 Configuración de Grid

### Desktop (≥1024px)
- **Columnas**: 4
- **Filas**: 3
- **Gap**: 16px
- **Padding**: 120px (top), 32px (lados)

### Tablet (640px - 1023px)
- **Columnas**: 3
- **Filas**: 3
- **Gap**: 12px
- **Padding**: 100px (top), 24px (lados)

### Mobile (<640px)
- **Columnas**: 2
- **Filas**: 4
- **Gap**: 8px
- **Padding**: 80px (top), 16px (lados)

## 🔧 Uso

### 1. Definir Paneles

```typescript
const [panels, setPanels] = useState<Panel[]>([
  { 
    id: 'vision', 
    name: 'Visión', 
    isOpen: true, 
    size: '2x1',  // Ancho x Alto en celdas
    priority: 10  // Mayor = se coloca primero
  },
  { 
    id: 'info', 
    name: 'Info', 
    isOpen: true, 
    size: '1x1', 
    priority: 9 
  },
]);
```

### 2. Calcular Posiciones

```typescript
import { 
  getGridConfig, 
  calculateAutoLayout, 
  PRESET_LAYOUTS 
} from '@/lib/gridSystem';

const [gridPositions, setGridPositions] = useState<Map<string, GridPosition>>(new Map());

useEffect(() => {
  const config = getGridConfig(window.innerWidth, window.innerHeight);
  const openPanels = panels.filter(p => p.isOpen);
  
  const layout = openPanels.map(p => ({
    id: p.id,
    size: p.size,
    priority: p.priority,
    preferredPosition: PRESET_LAYOUTS.default.find(preset => preset.id === p.id)?.preferredPosition
  }));

  const positions = calculateAutoLayout(layout, config, window.innerWidth, window.innerHeight);
  setGridPositions(positions);
}, [panels, windowSize]);
```

### 3. Usar en InfoPanel

```typescript
<InfoPanel 
  isOpen={panels.find(p => p.id === 'vision')?.isOpen || false}
  onClose={() => handleTogglePanel('vision')}
  title="Visión"
  subtitle="Transformando Ideas"
  status="processing"
  gridPosition={gridPositions.get('vision')}  // ← Usar gridPosition
>
  {/* Contenido */}
</InfoPanel>
```

## 📦 Tamaños de Panel

| Tamaño | Descripción | Uso Recomendado |
|--------|-------------|-----------------|
| `1x1` | Cuadrado básico | Info breve, contacto |
| `1x2` | Vertical doble | Listas, menús |
| `2x1` | Horizontal doble | Visión, hero text |
| `2x2` | Cuadrado grande | Contenido extenso |

## 🎨 Layouts Predefinidos

### Default
```typescript
PRESET_LAYOUTS.default = [
  { id: 'vision', size: '2x1', priority: 10, preferredPosition: { col: 2, row: 0 } },
  { id: 'info', size: '1x1', priority: 9, preferredPosition: { col: 0, row: 1 } },
  { id: 'services', size: '1x1', priority: 8, preferredPosition: { col: 1, row: 1 } },
  { id: 'contact', size: '1x1', priority: 7, preferredPosition: { col: 0, row: 2 } },
];
```

### Minimal
```typescript
PRESET_LAYOUTS.minimal = [
  { id: 'info', size: '1x1', priority: 10, preferredPosition: { col: 0, row: 0 } },
  { id: 'contact', size: '1x1', priority: 9, preferredPosition: { col: 3, row: 2 } },
];
```

### Showcase
```typescript
PRESET_LAYOUTS.showcase = [
  { id: 'vision', size: '2x2', priority: 10, preferredPosition: { col: 2, row: 0 } },
  { id: 'info', size: '1x1', priority: 9, preferredPosition: { col: 0, row: 0 } },
  { id: 'services', size: '1x2', priority: 8, preferredPosition: { col: 0, row: 1 } },
  { id: 'contact', size: '1x1', priority: 7, preferredPosition: { col: 1, row: 0 } },
];
```

## 🔄 Migración desde Sistema Legacy

El sistema mantiene compatibilidad con el código anterior:

```typescript
// Antiguo (aún funciona)
<InfoPanel 
  position="right-wide"
  offsetY={220}
  offsetX={270}
/>

// Nuevo (recomendado)
<InfoPanel 
  gridPosition={gridPositions.get('panel-id')}
/>
```

## 🎯 Ventajas

### Antes (Sistema Manual)
- ❌ Posiciones hardcodeadas con offsets
- ❌ No responsive
- ❌ Difícil mantener
- ❌ Colisiones manuales
- ❌ No escalable

### Ahora (Sistema Grid)
- ✅ Posicionamiento automático
- ✅ Totalmente responsive
- ✅ Fácil de mantener
- ✅ Sin colisiones
- ✅ Escalable a N paneles

## 🚀 Próximos Pasos

1. **Persistencia**: Guardar posiciones en localStorage
2. **Animaciones**: Transiciones suaves al reorganizar
3. **Snap to grid**: Opción de ajustar al soltar
4. **Resize**: Permitir cambiar tamaño de paneles
5. **Temas**: Diferentes layouts predefinidos seleccionables

## 📝 Notas Técnicas

- El sistema usa `window.innerWidth/Height` para cálculos
- Las posiciones se recalculan en resize
- Los paneles cerrados no ocupan espacio en el grid
- El drag está limitado por `dragConstraints` para evitar salir de pantalla
- El contenido de los paneles es scrollable automáticamente
