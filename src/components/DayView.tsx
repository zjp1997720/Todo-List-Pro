import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, CheckSquare, FileText, Smile, Clock } from 'lucide-react';
import ContentBlock from './ContentBlock';
import { ContentBlock as ContentBlockType, ContentType } from '../types';
import { generateId } from '../utils/storage';
import { formatDisplayDate, isToday } from '../utils/dateUtils';

interface DayViewProps {
  date: Date;
  blocks: ContentBlockType[];
  onBlocksUpdate: (blocks: ContentBlockType[]) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, blocks, onBlocksUpdate }) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over.id);
      
      onBlocksUpdate(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const handleAddBlock = (type: ContentType) => {
    const newBlock: ContentBlockType = {
      id: generateId(),
      type,
      title: getDefaultTitle(type),
      content: '',
      completed: false,
      subtasks: [],
      expanded: false,
      createdAt: Date.now(),
    };

    onBlocksUpdate([...blocks, newBlock]);
    setShowAddMenu(false);
  };

  const getDefaultTitle = (type: ContentType): string => {
    switch (type) {
      case 'todo':
        return '新的待办事项';
      case 'note':
        return '新的笔记';
      case 'mood':
        return '心情记录';
      case 'event':
        return '新的事件';
      default:
        return '新项目';
    }
  };

  const handleBlockUpdate = (updatedBlock: ContentBlockType) => {
    const updatedBlocks = blocks.map(block =>
      block.id === updatedBlock.id ? updatedBlock : block
    );
    onBlocksUpdate(updatedBlocks);
  };

  const handleBlockDelete = (blockId: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    onBlocksUpdate(updatedBlocks);
  };

  const blockTypes = [
    { type: 'todo' as ContentType, icon: CheckSquare, label: '待办事项', color: 'text-green-600' },
    { type: 'note' as ContentType, icon: FileText, label: '笔记', color: 'text-blue-600' },
    { type: 'mood' as ContentType, icon: Smile, label: '心情', color: 'text-yellow-600' },
    { type: 'event' as ContentType, icon: Clock, label: '事件', color: 'text-purple-600' },
  ];

  return (
    <div className="h-full p-4 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {formatDisplayDate(date)}
          </h1>
          {isToday(date) && (
            <span className="text-xs text-green-600 font-medium">今天</span>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center space-x-1 bg-green-600 text-white px-2 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-xs"
          >
            <Plus className="w-3 h-3" />
            <span>添加</span>
          </button>
          
          {showAddMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-2">
                {blockTypes.map(({ type, icon: Icon, label, color }) => (
                  <button
                    key={type}
                    onClick={() => handleAddBlock(type)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Icon className={`w-3 h-3 ${color}`} />
                    <span className="text-xs text-gray-700">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map(block => block.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {blocks.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-1 text-xs">这一天还是空的</p>
                <p className="text-xs text-gray-400">点击"添加"按钮来创建第一个项目</p>
              </div>
            ) : (
              blocks.map((block) => (
                <ContentBlock
                  key={block.id}
                  block={block}
                  onUpdate={handleBlockUpdate}
                  onDelete={handleBlockDelete}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DayView;