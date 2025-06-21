import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { ContentBlock } from '../types';
import WeekBlockItem from './WeekBlockItem';

interface MonthGridItemProps {
  date: Date;
  dateStr: string;
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  blocks: ContentBlock[];
  onDateSelect: (date: string) => void;
  onAddBlock: (date: string) => void;
}

const MonthGridItem: React.FC<MonthGridItemProps> = ({
  date,
  dateStr,
  isSelected,
  isToday,
  isCurrentMonth,
  blocks,
  onDateSelect,
  onAddBlock
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `date-${dateStr}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`border rounded-lg p-2 transition-all duration-200 min-h-[120px] cursor-pointer group relative ${
        !isCurrentMonth
          ? 'bg-gray-50 text-gray-400 border-gray-100'
          : isSelected
          ? 'bg-green-50 border-green-200 shadow-md ring-2 ring-green-100'
          : isOver
          ? 'bg-blue-50 border-blue-200 shadow-md ring-2 ring-blue-100'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-sm'
      }`}
      onClick={() => onDateSelect(dateStr)}
    >
      {/* 日期头部 */}
      <div className="flex items-center justify-between mb-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
          isToday
            ? 'bg-green-500 text-white shadow-sm'
            : isSelected && isCurrentMonth
            ? 'bg-green-100 text-green-700'
            : isCurrentMonth
            ? 'text-gray-700'
            : 'text-gray-400'
        }`}>
          {date.getDate()}
        </div>
        
        {isCurrentMonth && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddBlock(dateStr);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white hover:shadow-sm rounded transition-all"
          >
            <Plus className="w-3 h-3 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* 内容块列表 */}
      {isCurrentMonth && (
        <div className="space-y-1">
          {blocks.slice(0, 2).map((block) => (
            <WeekBlockItem key={block.id} block={block} compact />
          ))}
          
          {blocks.length > 2 && (
            <div className="text-xs text-gray-500 text-center py-1 bg-gray-100 rounded">
              +{blocks.length - 2}
            </div>
          )}
        </div>
      )}

      {/* 完成度指示器 */}
      {isCurrentMonth && blocks.length > 0 && (
        <div className="absolute bottom-1 right-1 flex items-center space-x-1">
          <div className={`w-1.5 h-1.5 rounded-full ${
            blocks.filter(b => b.type === 'todo' && b.completed).length === blocks.filter(b => b.type === 'todo').length && blocks.filter(b => b.type === 'todo').length > 0
              ? 'bg-green-400'
              : blocks.some(b => b.type === 'todo' && b.completed)
              ? 'bg-yellow-400'
              : 'bg-gray-300'
          }`} />
        </div>
      )}
    </div>
  );
};

export default MonthGridItem;