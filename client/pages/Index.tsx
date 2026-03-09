import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BuilderCanvas } from "@/components/builder/Canvas";

export default function Index() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 antialiased overflow-hidden">
        <header className="h-16 border-b bg-white px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg transform -rotate-3">
              V
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 leading-tight">
                VALASYS <span className="text-blue-600 font-black">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                Builder Pro
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              {["Templates", "History", "Insights", "Settings"].map((item) => (
                <button
                  key={item}
                  className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-all hover:-translate-y-0.5"
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm"
                  >
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="Avatar" />
                  </div>
                ))}
              </div>
              <button className="text-sm font-semibold px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95">
                Publish
              </button>
            </div>
          </div>
        </header>

        <main className="builder-main">
          <BuilderCanvas />
        </main>
      </div>
    </DndProvider>
  );
}
