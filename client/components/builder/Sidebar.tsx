import React from "react";
import { useDrag } from "react-dnd";
import { DRAG_TYPES, ComponentType } from "@/types/builder";
import { cn } from "@/lib/utils";
import {
  Layout,
  Type,
  Image as ImageIcon,
  Square,
  Columns,
  Rows,
} from "lucide-react";

interface SidebarItemProps {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ type, label, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPES.COMPONENT,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "flex items-center gap-3 p-3 mb-2 rounded-lg border bg-white cursor-move hover:border-blue-500 hover:text-blue-500 transition-colors shadow-sm",
        isDragging && "opacity-50 border-blue-500",
      )}
    >
      <div className="text-gray-500">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Layout
      </h2>
      <SidebarItem
        type="section"
        label="Section"
        icon={<Layout className="w-4 h-4" />}
      />
      <SidebarItem type="row" label="Row" icon={<Rows className="w-4 h-4" />} />
      <SidebarItem
        type="column"
        label="Column"
        icon={<Columns className="w-4 h-4" />}
      />

      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-8">
        Components
      </h2>
      <SidebarItem
        type="heading"
        label="Heading"
        icon={<Type className="w-4 h-4" />}
      />
      <SidebarItem type="text" label="Text" icon={<Type className="w-4 h-4" />} />
      <SidebarItem
        type="image"
        label="Image"
        icon={<ImageIcon className="w-4 h-4" />}
      />
      <SidebarItem
        type="button"
        label="Button"
        icon={<Square className="w-4 h-4" />}
      />
      <SidebarItem
        type="card"
        label="Card"
        icon={<Layout className="w-4 h-4" />}
      />

      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-8">
        Utilities
      </h2>
      <SidebarItem
        type="section"
        label="Container"
        icon={<Square className="w-4 h-4" />}
      />
    </div>
  );
};
