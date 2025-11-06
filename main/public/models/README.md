# Modelos 3D

## Instrucciones para agregar tu modelo de Blender

1. **Exporta tu modelo desde Blender:**
   - Selecciona tu modelo en Blender
   - Ve a: `File > Export > glTF 2.0 (.gltf/.glb)`
   - Configuración recomendada:
     - Format: `glTF Binary (.glb)` (más eficiente)
     - Include: Selected Objects
     - Transform: +Y Up
     - Geometry: Apply Modifiers, UVs, Normals, Vertex Colors
     - Animation: Si tienes animaciones, marca "Animation"

2. **Guarda el archivo:**
   - Nombre sugerido: `avatar.glb` o `avatar.gltf`
   - Coloca el archivo en esta carpeta: `/public/models/`

3. **El componente está configurado para cargar:**
   - Ruta por defecto: `/models/avatar.gltf`
   - Si usas otro nombre, actualiza la ruta en `Model3D.tsx`

## Características implementadas:

- ✅ Carga automática de modelos GLTF/GLB
- ✅ Mouse tracking (el modelo sigue el movimiento del mouse)
- ✅ Iluminación cyberpunk (cyan, red, purple)
- ✅ Fallback automático si no hay modelo
- ✅ Preload para mejor rendimiento

## Optimización del modelo:

Para mejor rendimiento, asegúrate de que tu modelo:
- Tenga menos de 50k polígonos
- Use texturas optimizadas (max 2048x2048)
- Esté centrado en el origen (0,0,0)
- Tenga escala apropiada (aproximadamente 1 unidad)

## Ajustar escala:

Si tu modelo es muy grande o pequeño, edita en `Model3D.tsx`:
```tsx
<primitive object={scene} scale={1} /> // Cambia el valor de scale
```
