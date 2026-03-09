import React from "react";
import { useDrop, useDrag } from "react-dnd";
import { BuilderComponent, DRAG_TYPES, ComponentType } from "@/types/builder";
import { cn } from "@/lib/utils";
import { Trash2, Move, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RendererProps {
  component: BuilderComponent;
  onUpdate: (id: string, updates: Partial<BuilderComponent>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, targetParentId: string | null, targetIndex: number) => void;
  onAdd: (type: ComponentType, parentId: string | null, index?: number) => void;
}

export const ComponentRenderer: React.FC<RendererProps> = ({
  component,
  onUpdate,
  onRemove,
  onMove,
  onAdd,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPES.COMPONENT,
    item: { id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DRAG_TYPES.COMPONENT,
    canDrop: (item: any) => {
      // Avoid nesting self
      if (item.id === component.id) return false;

      switch (component.type) {
        case "section":
          return item.type === "row" || !["section", "row", "column"].includes(item.type);
        case "row":
          return item.type === "column";
        case "column":
          return !["section", "row", "column"].includes(item.type);
        default:
          return false;
      }
    },
    drop: (item: any, monitor) => {
      if (monitor.didDrop()) return;

      if (item.id) {
        // Reordering
        onMove(item.id, component.id, component.children?.length || 0);
      } else {
        // Adding new
        onAdd(item.type, component.id, component.children?.length || 0);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const renderChildren = () => {
    return (
      <div
        ref={drop}
        className={cn(
          "min-h-[50px] transition-colors rounded-md border border-dashed border-gray-200 p-2",
          isOver && canDrop && "bg-blue-50 border-blue-300",
          component.type === "row" && "flex flex-wrap -mx-2",
          component.type === "section" && "space-y-4 p-4",
          component.type === "column" && "p-2 h-full flex flex-col gap-2",
        )}
      >
        {component.children?.map((child, index) => (
          <ComponentRenderer
            key={child.id}
            component={child}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onMove={onMove}
            onAdd={onAdd}
          />
        ))}
        {component.children?.length === 0 && (
          <div className="flex items-center justify-center h-full min-h-[50px] text-gray-400 text-xs italic">
            Drop items here
          </div>
        )}
      </div>
    );
  };

  const wrapWithControls = (content: React.ReactNode) => {
    const isResizable = ["section", "image", "card", "heading", "text"].includes(component.type);

    return (
      <div
        ref={drag}
        className={cn(
          "group relative border border-transparent hover:border-blue-500 rounded-md transition-all",
          isDragging && "opacity-30",
          component.type === "section" && "my-4",
          component.type === "column" && "w-full md:w-auto h-full",
        )}
        style={{
          ...(component.type === "column"
            ? { flex: `0 0 ${((component.width || 12) / 12) * 100}%`, padding: "0 0.5rem" }
            : {}),
          ...(component.height ? { minHeight: `${component.height}px` } : {}),
        }}
      >
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 flex items-center bg-blue-500 rounded-bl-md text-white px-1 z-20 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:text-white hover:bg-blue-600"
            onClick={() => onRemove(component.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <div className="h-6 w-6 flex items-center justify-center cursor-move">
            <Move className="h-3.5 w-3.5" />
          </div>
        </div>

        {component.type === "column" && (
          <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 flex items-center justify-between bg-blue-500/10 px-2 py-1 z-10 text-xs font-bold text-blue-600 pointer-events-none">
            <div className="flex items-center gap-1 pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 bg-white border shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(component.id, { width: Math.max(1, (component.width || 12) - 1) });
                }}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span>{component.width}/12</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 bg-white border shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(component.id, { width: Math.min(12, (component.width || 1) + 1) });
                }}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {isResizable && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1.5 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-blue-400/50 hover:bg-blue-500 transition-all z-10"
            onMouseDown={(e) => {
              e.preventDefault();
              const startY = e.clientY;
              const startHeight = component.height || 100;

              const onMouseMove = (moveEvent: MouseEvent) => {
                const newHeight = Math.max(50, startHeight + (moveEvent.clientY - startY));
                onUpdate(component.id, { height: newHeight });
              };

              const onMouseUp = () => {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
              };

              window.addEventListener("mousemove", onMouseMove);
              window.addEventListener("mouseup", onMouseUp);
            }}
          />
        )}

        {content}
      </div>
    );
  };

  switch (component.type) {
    case "section":
      return wrapWithControls(
        <section className="bg-white rounded-lg shadow-sm">
          <div className="px-2 py-1 text-[10px] uppercase font-bold text-gray-400">Section</div>
          {renderChildren()}
        </section>
      );
    case "row":
      return wrapWithControls(
        <div className="bg-gray-50/50 rounded p-2">
          <div className="px-1 py-0.5 text-[10px] uppercase font-bold text-gray-400">Row</div>
          {renderChildren()}
        </div>
      );
    case "column":
      return wrapWithControls(
        <div className="bg-blue-50/20 rounded border border-blue-100/30 min-h-[60px]">
          <div className="px-1 py-0.5 text-[10px] uppercase font-bold text-blue-400">Column</div>
          {renderChildren()}
        </div>
      );
    case "heading":
      return wrapWithControls(
        <div className="p-4 h-full flex items-center">
           <h2 className="text-2xl font-bold w-full" contentEditable suppressContentEditableWarning>New Heading</h2>
        </div>
      );
    case "text":
      return wrapWithControls(
        <div className="p-4 h-full">
           <p className="text-gray-600" contentEditable suppressContentEditableWarning>Sample text content. Edit this directly in the canvas.</p>
        </div>
      );
    case "image":
      return wrapWithControls(
        <div className="p-4 h-full">
           <div className="h-full bg-gray-200 flex items-center justify-center rounded-lg text-gray-400">
             Image Placeholder
           </div>
        </div>
      );
    case "button":
      return wrapWithControls(
        <div className="p-4 h-full flex items-center justify-center">
           <Button>Click Me</Button>
        </div>
      );
    case "card":
      return wrapWithControls(
        <div className="p-4 h-full">
           <div className="bg-white border rounded-xl p-4 shadow-sm h-full">
             <h3 className="font-semibold mb-2" contentEditable suppressContentEditableWarning>Card Title</h3>
             <p className="text-sm text-gray-500" contentEditable suppressContentEditableWarning>Some content for the card.</p>
           </div>
        </div>
      );
    default:
      return null;
  }
};
