export type ComponentType =
  | "section"
  | "row"
  | "column"
  | "text"
  | "image"
  | "button"
  | "heading"
  | "card";

export interface BuilderComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  children?: BuilderComponent[];
  width?: number; // 1-12 for columns
  height?: number; // pixels for components
}

export const DRAG_TYPES = {
  COMPONENT: "COMPONENT",
  LAYOUT: "LAYOUT",
};
