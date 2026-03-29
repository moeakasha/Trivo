import { useState, useEffect, useRef } from "react";
import {
  ZOOM_MIN, ZOOM_MAX,
  AUTO_ROTATE_SPEED, AUTO_ROTATE_INTERVAL_MS,
  DRAG_SENSITIVITY,
} from "../../../../core/constants/globe";

type Point = { x: number; y: number };
type Rotation = [number, number, number];

export interface GlobeControls {
  rotation: Rotation;
  zoom: number;
  isDragging: boolean;
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerLeave: (e: React.PointerEvent) => void;
    onWheel: (e: React.WheelEvent) => void;
  };
}

const dist = (a: Point, b: Point) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const clamp = (v: number) => Math.min(Math.max(v, ZOOM_MIN), ZOOM_MAX);

export function useGlobeControls(): GlobeControls {
  const [rotation, setRotation] = useState<Rotation>([0, -20, 0]);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const pointers = useRef<Map<number, Point>>(new Map());
  const pinchDist = useRef<number | null>(null);
  const pinchZoom = useRef(1);
  const lastPos = useRef<Point>({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      setIsDragging(true);
      lastPos.current = { x: e.clientX, y: e.clientY };
    } else if (pointers.current.size === 2) {
      setIsDragging(false);
      const pts = Array.from(pointers.current.values());
      pinchDist.current = dist(pts[0], pts[1]);
      pinchZoom.current = zoom;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1 && isDragging) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      setRotation(r => [r[0] + (dx * DRAG_SENSITIVITY) / zoom, r[1] - (dy * DRAG_SENSITIVITY) / zoom, 0]);
      lastPos.current = { x: e.clientX, y: e.clientY };
    } else if (pointers.current.size === 2 && pinchDist.current !== null) {
      const pts = Array.from(pointers.current.values());
      setZoom(clamp(pinchZoom.current * (dist(pts[0], pts[1]) / pinchDist.current)));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchDist.current = null;
    if (pointers.current.size === 0) setIsDragging(false);
  };

  const onWheel = (e: React.WheelEvent) => {
    setZoom(z => clamp(z * (e.deltaY < 0 ? 1.1 : 0.9)));
  };

  useEffect(() => {
    if (isDragging || pointers.current.size > 0) return;
    const id = setInterval(
      () => setRotation(r => [r[0] + AUTO_ROTATE_SPEED, r[1], r[2]]),
      AUTO_ROTATE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [isDragging]);

  return { rotation, zoom, isDragging, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerLeave: onPointerUp, onWheel } };
}
