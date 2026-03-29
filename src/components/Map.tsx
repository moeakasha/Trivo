import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useMemo,
    forwardRef,
    useImperativeHandle,
    ReactNode
} from 'react';
import { createPortal } from 'react-dom';
import MapLibreGL from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for Tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const defaultStyles = {
    light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

export type MapViewport = {
    center: [number, number];
    zoom: number;
    bearing?: number;
    pitch?: number;
};

type MapContextValue = {
    map: MapLibreGL.Map | null;
    isLoaded: boolean;
};

const MapContext = createContext<MapContextValue | null>(null);

export function useMap() {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error("useMap must be used within a Map component");
    }
    return context;
}

export type MapRef = {
    getMap: () => MapLibreGL.Map | null;
};

type MapProps = {
    center?: [number, number];
    zoom?: number;
    bearing?: number;
    pitch?: number;
    style?: string;
    theme?: 'light' | 'dark' | 'system';
    className?: string;
    children?: ReactNode;
    attributionControl?: boolean;
};

export const Map = forwardRef<MapRef, MapProps>(({
    center = [0, 0],
    zoom = 1,
    bearing = 0,
    pitch = 0,
    style,
    theme = 'light',
    className,
    children,
    attributionControl = false,
    ...props
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mapInstance, setMapInstance] = useState<MapLibreGL.Map | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const mapStyle = useMemo(() => {
        if (style) return style;
        return theme === 'dark' ? defaultStyles.dark : defaultStyles.light;
    }, [style, theme]);

    useImperativeHandle(ref, () => ({
        getMap: () => mapInstance,
    }));

    useEffect(() => {
        if (!containerRef.current) return;

        const map = new MapLibreGL.Map({
            container: containerRef.current,
            style: mapStyle,
            center: center,
            zoom: zoom,
            bearing: bearing,
            pitch: pitch,
            attributionControl: attributionControl,
        });

        map.on('load', () => {
            setIsLoaded(true);
            setMapInstance(map);
        });

        return () => {
            map.remove();
        };
    }, []); // Only on mount

    useEffect(() => {
        if (mapInstance && isLoaded) {
            mapInstance.flyTo({ center, zoom });
        }
    }, [center, zoom, mapInstance, isLoaded]);

    return (
        <div className={cn("relative w-full h-full", className)} ref={containerRef}>
            <MapContext.Provider value={{ map: mapInstance, isLoaded }}>
                {isLoaded && children}
            </MapContext.Provider>
        </div>
    );
});

// Marker Component
type MapMarkerProps = {
    center: [number, number];
    children?: ReactNode;
    className?: string;
};

export function MapMarker({ center, children, className }: MapMarkerProps) {
    const { map, isLoaded } = useMap();
    const [element] = useState(() => document.createElement('div'));

    useEffect(() => {
        if (!map || !isLoaded) return;

        element.className = cn("map-marker", className);

        const marker = new MapLibreGL.Marker({ element })
            .setLngLat(center)
            .addTo(map);

        return () => {
            marker.remove();
        };
    }, [map, isLoaded, center, className, element]);

    return createPortal(children, element);
}
