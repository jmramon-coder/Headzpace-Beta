import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DndContext, DragEndEvent, pointerWithin } from '@dnd-kit/core';
import { useViewport } from '../context/ViewportContext';
import { useViewportControls } from '../hooks/useViewportControls';
import { useSelectionBox } from '../hooks/useSelectionBox';
import { useGroupDragging } from '../hooks/useGroupDragging';
import { useWorkspace } from '../hooks/useWorkspace';
import { useImageDrop } from '../hooks/useImageDrop';
import { HANDLE_OFFSET } from '../utils/constants';
import { SelectionBox } from './SelectionBox';
import { GroupHandle } from './GroupHandle';
import { Widget } from '../types';
import { GRID_SIZE, calculateGridPosition, findNextAvailablePosition, getDefaultWidgetSize, getDefaultWidgetPosition } from '../utils/grid';
import { Toast } from './ui/Toast'; 
import { Save } from 'lucide-react';
import { useLayout } from '../context/LayoutContext';
import { BentoButton } from './widgets/BentoButton';
import { BentoSelector } from './widgets/BentoSelector';
import { SaveLayoutModal } from './widgets/SaveLayoutModal';
import { WidgetWrapper } from './WidgetWrapper';
import { Clock as ClockWidget } from './widgets/Clock';
import { Notes } from './widgets/Notes';
import { Tasks } from './widgets/Tasks';
import { LoginModal } from './auth/LoginModal';
import { Media } from './widgets/Media';
import { ChatWidget } from './widgets/Chat';
import { Radio as RadioWidget } from './widgets/Radio';

const EMPTY_WIDGETS: Widget[] = [
  {
    id: 'default-chat',
    type: 'chat',
    position: { x: GRID_SIZE * 24, y: GRID_SIZE * 12 },
    size: { width: GRID_SIZE * 40, height: GRID_SIZE * 32 }
  },
  {
    id: 'default-tasks',
    type: 'tasks',
    position: { x: GRID_SIZE * 66, y: GRID_SIZE * 12 },
    size: { width: GRID_SIZE * 32, height: GRID_SIZE * 32 }
  },
  {
    id: 'default-media-1',
    type: 'media',
    position: { x: GRID_SIZE * 24, y: GRID_SIZE * 46 },
    size: { width: GRID_SIZE * 36, height: GRID_SIZE * 28 },
    defaultImages: [
      'https://res.cloudinary.com/dpfbkeapy/image/upload/v1733940233/maza2019_surrealistic_linocut_black__white_art_of_a_guyanese_bl_5b4f758b-b775-40d0-979e-7a75b5482ae9_foh91l.png',
      'https://res.cloudinary.com/dpfbkeapy/image/upload/v1733940237/joekr_engineer_armor_--v_6.1_e3b1abe8-412f-4fd4-96f1-1018efb9877f_b2mbnz.png'
    ]
  },
  {
    id: 'default-media-2',
    type: 'media',
    position: { x: GRID_SIZE * 62, y: GRID_SIZE * 46 },
    size: { width: GRID_SIZE * 36, height: GRID_SIZE * 28 },
    defaultImages: [
      'https://res.cloudinary.com/dpfbkeapy/image/upload/v1733947883/creatorstuart_Red_balloons_float_on_a_misty_street_in_1920s_Der_d5c5aeac-c3f4-4335-a199-f60beb9e6064_b7q3di.png',
      'https://res.cloudinary.com/dpfbkeapy/image/upload/v1733947880/s3chek_92897_real_image_of_wooden_bench_in_nature_on_top_of_a_h_cf577a48-3c31-4ee5-85fa-4ea849a8bc24_fvirjt.png'
    ]
  },
  {
    id: 'default-clock',
    type: 'clock',
    position: { x: GRID_SIZE * 100, y: GRID_SIZE * 12 },
    size: { width: GRID_SIZE * 24, height: GRID_SIZE * 15 }
  },
  {
    id: 'default-radio',
    type: 'radio',
    position: { x: GRID_SIZE * 100, y: GRID_SIZE * 29 },
    size: { width: GRID_SIZE * 24, height: GRID_SIZE * 45 }
  }
];
import { NavigationBar } from './navigation/NavigationBar';
import { SaveIndicator } from './workspace/SaveIndicator';

export const Dashboard = () => {
  const { viewport } = useViewport();
  useViewportControls();
  const {
    isSelecting,
    selectionBox,
    selectedWidgets,
    handleSelectionStart,
    handleSelectionMove,
    handleSelectionEnd,
    setSelectedWidgets
  } = useSelectionBox();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isBentoOpen, setIsBentoOpen] = useState(false);
  const [isSaveLayoutOpen, setIsSaveLayoutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { currentLayout, defaultLayout } = useLayout();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [groupHandlePosition, setGroupHandlePosition] = useState({ x: 0, y: 0 });
  
  const { hasUnsavedChanges, saveWorkspace, loadWorkspace } = useWorkspace(widgets, setWidgets);
  
  const addWidget = useCallback((options: { type: Widget['type']; defaultImages?: string[] }) => {
    const position = findNextAvailablePosition(widgets);
    const size = getDefaultWidgetSize(options.type);

    const newWidget: Widget = {
      id: crypto.randomUUID(),
      type: options.type,
      position,
      size,
      defaultImages: options.defaultImages
    };
    
    setWidgets([...widgets, newWidget]);
    setToast(`${options.type.charAt(0).toUpperCase() + options.type.slice(1)} widget added`);
  }, [widgets]);

  const { isDragging, startDragging } = useGroupDragging(widgets, selectedWidgets, setWidgets);
  const { handleDragOver, handleDrop } = useImageDrop(addWidget);

  // Handle selection box movement
  useEffect(() => {
    if (isSelecting) {
      window.addEventListener('mousemove', handleSelectionMove);
      window.addEventListener('mouseup', () => handleSelectionEnd(widgets));
      return () => {
        window.removeEventListener('mousemove', handleSelectionMove);
        window.removeEventListener('mouseup', () => handleSelectionEnd(widgets));
      };
    }
  }, [isSelecting, handleSelectionMove, handleSelectionEnd, widgets]);

  // Update group handle position
  useEffect(() => {
    if (selectedWidgets.length > 0) {
      // Find top-right most widget
      let maxX = -Infinity;
      let minY = Infinity;
      
      selectedWidgets.forEach(id => {
        const widget = widgets.find(w => w.id === id);
        if (widget) {
          maxX = Math.max(maxX, widget.position.x + widget.size.width);
          minY = Math.min(minY, widget.position.y);
        }
      });
      
      setGroupHandlePosition({ x: maxX + HANDLE_OFFSET, y: minY - HANDLE_OFFSET });
    }
  }, [selectedWidgets, widgets]);

  // Apply default layout on mount
  useEffect(() => {
    if (!defaultLayout?.widgets) {
      setWidgets(EMPTY_WIDGETS);
      return;
    }
    
    setWidgets(defaultLayout.widgets.map(widget => ({
      ...widget,
      id: crypto.randomUUID()
    })));
  }, [defaultLayout]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!active) return;
    
    // Clear selection when dragging individual widgets
    if (!selectedWidgets.includes(active.id as string)) {
      setSelectedWidgets([]);
    }
    
    // If dragging a selected widget, move all selected widgets
    if (selectedWidgets.includes(active.id as string)) {
      setWidgets(widgets.map(widget => {
        if (selectedWidgets.includes(widget.id)) {
          const newPosition = calculateGridPosition(
            widget.position.x + delta.x,
            widget.position.y + delta.y
          );

          return {
            ...widget,
            position: newPosition,
          };
        }
        return widget;
      }));
      return;
    }

    // Otherwise just move the dragged widget
    setWidgets(widgets.map(widget => {
      if (widget.id === active.id) {
        const newPosition = calculateGridPosition(
          widget.position.x + delta.x,
          widget.position.y + delta.y
        );

        return {
          ...widget,
          position: newPosition,
        };
      }
      return widget;
    }));
  };

  const removeWidget = (id: string) => {
    setWidgets(prevWidgets => prevWidgets.filter(widget => widget.id !== id));
  };

  const handleResize = (id: string, size: { width: number; height: number }) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, size } : widget
    ));
  };

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'clock':
        return <ClockWidget />;
      case 'notes':
        return <Notes />;
      case 'tasks':
        return <Tasks />;
      case 'media':
        return <Media widget={widget} />;
      case 'chat':
        return <ChatWidget />;
      case 'radio':
        return <RadioWidget />;
      default:
        return null;
    }
  };
  return (
    <div 
      className="relative flex-1 p-4 sm:p-8 overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseDown={(e) => {
        // Only start selection if clicking on the background
        if (e.target === e.currentTarget) {
          handleSelectionStart(e);
        }
      }}
    >
      <SaveIndicator 
        hasUnsavedChanges={hasUnsavedChanges} 
        onSave={saveWorkspace} 
        onSignIn={() => setIsLoginOpen(true)} 
      />
      
      {/* Fixed UI Elements */}
      <div className="bento-button fixed top-4 right-4 z-[70] pointer-events-auto">
        <BentoButton onClick={() => setIsBentoOpen(true)} />
      </div>
      
      {/* Modals */}
      <BentoSelector
        isOpen={isBentoOpen}
        onClose={() => setIsBentoOpen(false)}
        onSaveLayout={() => setIsSaveLayoutOpen(true)}
        isAuthenticated={true}
        onSelect={(type) => addWidget({ type })}
      />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {isSaveLayoutOpen && (
        <SaveLayoutModal
          isOpen={isSaveLayoutOpen}
          onClose={() => setIsSaveLayoutOpen(false)}
          currentWidgets={widgets}
        />
      )}
      
      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          initialMode="signup"
          onLogin={() => setIsLoginOpen(false)}
        />
      )}

      <div
        className="relative transition-transform duration-75 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          transform: `scale(${viewport.scale}) translate3d(${viewport.position.x}px, ${viewport.position.y}px, 0)`,
          transformOrigin: 'center center'
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 -z-10">
          <div className="w-full h-full grid grid-cols-[repeat(auto-fill,8px)] grid-rows-[repeat(auto-fill,8px)] opacity-10 pointer-events-none">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border-r border-t border-cyan-500/30" />
            ))}
          </div>
        </div>

        <DndContext 
          onDragEnd={handleDragEnd}
          collisionDetection={pointerWithin}
        >
          {widgets.map((widget) => (
            <WidgetWrapper
              key={widget.id}
              widget={widget}
              isSelected={selectedWidgets.includes(widget.id)}
              onRemove={removeWidget}
              onResize={handleResize}
            >
              {renderWidgetContent(widget)}
            </WidgetWrapper>
          ))}
        </DndContext>
      </div>
      {isSelecting && selectionBox && <SelectionBox selectionBox={selectionBox} />}
      <GroupHandle
        selectedCount={selectedWidgets.length}
        onDragStart={startDragging}
        style={{
          left: `${groupHandlePosition.x}px`,
          top: `${groupHandlePosition.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      />
      <div className="navigation-bar">
        <NavigationBar />
      </div>
    </div>
  );
};