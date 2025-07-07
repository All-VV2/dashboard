declare module 'leaflet.heat' {
  import * as L from 'leaflet';

  // Extend Leaflet's namespace
  declare module 'leaflet' {
    function heatLayer(
      latlngs: Array<[number, number, number?]>,
      options?: {
        minOpacity?: number;
        maxZoom?: number;
        max?: number;
        radius?: number;
        blur?: number;
        gradient?: { [key: number]: string };
      }
    ): Layer;
  }
}