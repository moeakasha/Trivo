import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./Globe.css";

const LAND_COLOR = "#1C2120";
const HIGHLIGHT_COLOR = "#4CAF50";

const STYLE: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    world: {
      type: "vector",
      url: "https://demotiles.maplibre.org/tiles/tiles.json",
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#FFFFFF" },
    },
    {
      id: "countries-fill",
      type: "fill",
      source: "world",
      "source-layer": "countries",
      paint: { "fill-color": LAND_COLOR },
    },
    {
      id: "countries-border",
      type: "line",
      source: "world",
      "source-layer": "countries",
      paint: { "line-color": "#2A3030", "line-width": 0.5 },
    },
  ],
};

interface Props {
  spin?: boolean;
}

const Globe: React.FC<Props> = ({ spin = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const rafRef = useRef<number>(0);
  const spinning = useRef(spin);
  const selected = useRef<Set<string>>(new Set());
  const propKey = useRef<string>("name"); // discovered on first click

  const applyColors = (map: maplibregl.Map) => {
    const list = Array.from(selected.current);
    map.setPaintProperty(
      "countries-fill",
      "fill-color",
      list.length
        ? ["match", ["get", propKey.current], list, HIGHLIGHT_COLOR, LAND_COLOR]
        : LAND_COLOR
    );
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      zoom: 1.5,
      center: [45, 25],
      interactive: true,
      attributionControl: false,
    });

    mapRef.current = map;

    const spin = () => {
      if (spinning.current) {
        const c = map.getCenter();
        map.setCenter([c.lng - 0.08, c.lat]);
      }
      rafRef.current = requestAnimationFrame(spin);
    };

    map.on("load", () => {
      map.setProjection({ type: "globe" });
      rafRef.current = requestAnimationFrame(spin);
    });

    map.on("click", "countries-fill", (e) => {
      if (!e.features?.length) return;

      const props = e.features[0].properties ?? {};

      // Discover the right property key on first click
      const discovered = ["name", "NAME", "iso_a2", "ISO_A2", "id"].find(
        (k) => props[k] != null
      );
      if (!discovered) return;
      propKey.current = discovered;

      const key = String(props[discovered]);
      if (selected.current.has(key)) selected.current.delete(key);
      else selected.current.add(key);

      applyColors(map);

      // Pause spin briefly so tap feels responsive
      spinning.current = false;
      setTimeout(() => { spinning.current = true; }, 800);
    });

    map.on("mouseenter", "countries-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "countries-fill", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("dragstart",  () => { spinning.current = false; });
    map.on("dragend",    () => { spinning.current = spin; });
    map.on("touchstart", () => { spinning.current = false; });
    map.on("touchend",   () => { spinning.current = spin; });

    return () => {
      cancelAnimationFrame(rafRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="globe-map" />;
};

export default Globe;
