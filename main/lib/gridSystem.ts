/**
 * Sistema de Grid para organización automática de InfoPanels
 * Divide la pantalla en una cuadrícula y asigna posiciones inteligentemente
 */

export type GridPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PanelSize = '1x1' | '1x2' | '2x1' | '2x2';

export interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

/**
 * Configuración de grid según el tamaño de pantalla
 */
export function getGridConfig(width: number, height: number): GridConfig {
  // Mobile
  if (width < 640) {
    return {
      columns: 2,
      rows: 4,
      gap: 8,
      padding: { top: 120, right: 16, bottom: 16, left: 16 }
    };
  }
  
  // Tablet
  if (width < 1024) {
    return {
      columns: 3,
      rows: 3,
      gap: 12,
      padding: { top: 150, right: 24, bottom: 24, left: 24 }
    };
  }
  
  // Desktop
  return {
    columns: 4,
    rows: 3,
    gap: 20,
    padding: { top: 180, right: 32, bottom: 80, left: 32 }
  };
}

/**
 * Convierte tamaño de panel a dimensiones de grid
 */
export function panelSizeToGrid(size: PanelSize): { cols: number; rows: number } {
  switch (size) {
    case '1x1': return { cols: 1, rows: 1 };
    case '1x2': return { cols: 1, rows: 2 };
    case '2x1': return { cols: 2, rows: 1 };
    case '2x2': return { cols: 2, rows: 2 };
  }
}

/**
 * Calcula la posición en píxeles de una celda del grid
 */
export function calculateCellPosition(
  col: number,
  row: number,
  config: GridConfig,
  viewportWidth: number,
  viewportHeight: number
): GridPosition {
  const availableWidth = viewportWidth - config.padding.left - config.padding.right;
  const availableHeight = viewportHeight - config.padding.top - config.padding.bottom;
  
  const cellWidth = (availableWidth - (config.columns - 1) * config.gap) / config.columns;
  const cellHeight = (availableHeight - (config.rows - 1) * config.gap) / config.rows;
  
  const x = config.padding.left + col * (cellWidth + config.gap);
  const y = config.padding.top + row * (cellHeight + config.gap);
  
  return {
    x,
    y,
    width: cellWidth,
    height: cellHeight
  };
}

/**
 * Calcula la posición de un panel según su tamaño
 */
export function calculatePanelPosition(
  col: number,
  row: number,
  size: PanelSize,
  config: GridConfig,
  viewportWidth: number,
  viewportHeight: number
): GridPosition {
  const { cols, rows } = panelSizeToGrid(size);
  const basePosition = calculateCellPosition(col, row, config, viewportWidth, viewportHeight);
  
  // Ajustar ancho y alto según el tamaño del panel
  const availableWidth = viewportWidth - config.padding.left - config.padding.right;
  const availableHeight = viewportHeight - config.padding.top - config.padding.bottom;
  
  const cellWidth = (availableWidth - (config.columns - 1) * config.gap) / config.columns;
  const cellHeight = (availableHeight - (config.rows - 1) * config.gap) / config.rows;
  
  return {
    x: basePosition.x,
    y: basePosition.y,
    width: cellWidth * cols + config.gap * (cols - 1),
    height: cellHeight * rows + config.gap * (rows - 1)
  };
}

/**
 * Grid ocupado - para evitar colisiones
 */
export class GridOccupancy {
  private grid: boolean[][];
  
  constructor(columns: number, rows: number) {
    this.grid = Array(rows).fill(null).map(() => Array(columns).fill(false));
  }
  
  /**
   * Verifica si una posición está disponible
   */
  isAvailable(col: number, row: number, cols: number, rows: number): boolean {
    if (col < 0 || row < 0 || col + cols > this.grid[0].length || row + rows > this.grid.length) {
      return false;
    }
    
    for (let r = row; r < row + rows; r++) {
      for (let c = col; c < col + cols; c++) {
        if (this.grid[r][c]) return false;
      }
    }
    
    return true;
  }
  
  /**
   * Marca una posición como ocupada
   */
  occupy(col: number, row: number, cols: number, rows: number): void {
    for (let r = row; r < row + rows; r++) {
      for (let c = col; c < col + cols; c++) {
        this.grid[r][c] = true;
      }
    }
  }
  
  /**
   * Encuentra la primera posición disponible para un panel
   */
  findAvailablePosition(cols: number, rows: number): { col: number; row: number } | null {
    for (let r = 0; r <= this.grid.length - rows; r++) {
      for (let c = 0; c <= this.grid[0].length - cols; c++) {
        if (this.isAvailable(c, r, cols, rows)) {
          return { col: c, row: r };
        }
      }
    }
    return null;
  }
}

/**
 * Layout automático de paneles
 */
export interface PanelLayout {
  id: string;
  size: PanelSize;
  priority?: number; // Mayor prioridad = se coloca primero
  preferredPosition?: { col: number; row: number };
}

export function calculateAutoLayout(
  panels: PanelLayout[],
  config: GridConfig,
  viewportWidth: number,
  viewportHeight: number
): Map<string, GridPosition> {
  const occupancy = new GridOccupancy(config.columns, config.rows);
  const positions = new Map<string, GridPosition>();
  
  // Ordenar por prioridad (mayor primero)
  const sortedPanels = [...panels].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  
  for (const panel of sortedPanels) {
    const { cols, rows } = panelSizeToGrid(panel.size);
    
    let position: { col: number; row: number } | null = null;
    
    // Intentar posición preferida primero
    if (panel.preferredPosition) {
      const { col, row } = panel.preferredPosition;
      if (occupancy.isAvailable(col, row, cols, rows)) {
        position = { col, row };
      }
    }
    
    // Si no hay posición preferida o no está disponible, buscar automáticamente
    if (!position) {
      position = occupancy.findAvailablePosition(cols, rows);
    }
    
    // Si encontramos posición, calcular y guardar
    if (position) {
      occupancy.occupy(position.col, position.row, cols, rows);
      const gridPosition = calculatePanelPosition(
        position.col,
        position.row,
        panel.size,
        config,
        viewportWidth,
        viewportHeight
      );
      positions.set(panel.id, gridPosition);
    }
  }
  
  return positions;
}

/**
 * Posiciones predefinidas para diferentes layouts
 */
export const PRESET_LAYOUTS = {
  default: [
    { id: 'vision', size: '1x1' as PanelSize, priority: 10, preferredPosition: { col: 0, row: 0 } }, // Esquina superior izquierda
    { id: 'info', size: '1x1' as PanelSize, priority: 9, preferredPosition: { col: 3, row: 0 } }, // Esquina superior derecha
    { id: 'services', size: '1x1' as PanelSize, priority: 8, preferredPosition: { col: 0, row: 2 } }, // Esquina inferior izquierda
    { id: 'contact', size: '1x1' as PanelSize, priority: 7, preferredPosition: { col: 3, row: 2 } }, // Esquina inferior derecha
  ],
  minimal: [
    { id: 'info', size: '1x1' as PanelSize, priority: 10, preferredPosition: { col: 0, row: 0 } },
    { id: 'contact', size: '1x1' as PanelSize, priority: 9, preferredPosition: { col: 3, row: 2 } },
  ],
  showcase: [
    { id: 'vision', size: '2x2' as PanelSize, priority: 10, preferredPosition: { col: 2, row: 0 } },
    { id: 'info', size: '1x1' as PanelSize, priority: 9, preferredPosition: { col: 0, row: 0 } },
    { id: 'services', size: '1x2' as PanelSize, priority: 8, preferredPosition: { col: 0, row: 1 } },
    { id: 'contact', size: '1x1' as PanelSize, priority: 7, preferredPosition: { col: 1, row: 0 } },
  ]
};
