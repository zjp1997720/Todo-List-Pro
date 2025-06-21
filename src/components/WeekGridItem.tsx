import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { formatDisplayDate } from '../utils/dateUtils';
import { ContentBlock } from '../types';
import WeekBlockItem from './WeekBlockItem';

interface WeekGridItemProps {
  date: Date;
  dateStr: string;
  isSelected: boolean;
  isToday: boolean;
  blocks: ContentBlock[];
  onDateSelect: (date: string) => void;
  onAddBlock: (date: string) => void;
}

const WeekGridItem: React.FC<WeekGridItemProps> = ({
  date,
  dateStr,
  isSelected,
  isToday,
  blocks,
  onDateSelect,
  onAddBlock
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `date-${dateStr}`,
  });

  // 获取星期几的中文名称
  const getWeekdayName = (date: Date): string => {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  };

  return (
    <div
      ref={setNodeRef}
      className={`border rounded-xl p-4 transition-all duration-300 min-h-[200px] cursor-pointer group relative ${
        isSelected
          ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 shadow-lg ring-2 ring-green-200 transform scale-[1.02]'
          : isOver
          ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-lg ring-2 ring-blue-200 transform scale-[1.01]'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md hover:border-gray-300'
      }`}
      onClick={() => onDateSelect(dateStr)}
    >
      {/* 日期头部 - 重新设计 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-col items-center space-y-1">
          {/* 日期数字 */}
          <div className={`relative ${
            isToday
              ? 'w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-200 ring-2 ring-green-300'
              : isSelected
              ? 'w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 text-green-800 shadow-md ring-2 ring-green-300'
              : 'w-10 h-10 rounded-xl bg-white text-gray-700 border-2 border-gray-200 shadow-sm group-hover:border-gray-300 group-hover:shadow-md'
          } flex items-center justify-center font-bold text-xl transition-all duration-300`}>
            {date.getDate()}
            {isToday && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full ring-2 ring-white animate-pulse"></div>
            )}
          </div>
          
          {/* 星期几 */}
          <div className={`text-center transition-all duration-300 ${
            isToday
              ? 'text-green-600 font-bold text-sm'
              : isSelected
              ? 'text-green-700 font-semibold text-sm'
              : 'text-gray-500 font-medium text-xs group-hover:text-gray-600'
          }`}>
            {getWeekdayName(date)}
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddBlock(dateStr);
          }}
          className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            isSelected ? 'opacity-100' : ''
          } p-2 hover:bg-white/80 hover:shadow-lg rounded-xl backdrop-blur-sm`}
        >
          <Plus className="w-4 h-4 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {/* 内容块列表 */}
      <div className="space-y-2">
        {blocks.slice(0, 4).map((block) => (
          <WeekBlockItem key={block.id} block={block} compact />
        ))}
        
        {blocks.length > 4 && (
          <div className="text-xs text-gray-500 text-center py-2 bg-gray-100 rounded-lg font-medium">
            还有 {blocks.length - 4} 项
          </div>
        )}
        
        {blocks.length === 0 && (
          <div className="text-xs text-gray-400 text-center py-8 italic">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 opacity-50">
              <Plus className="w-4 h-4" />
            </div>
            点击添加内容
          </div>
        )}
      </div>

      {/* 完成度指示器 */}
      {blocks.length > 0 && (
        <div className="absolute bottom-3 right-3 flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
            blocks.filter(b => b.type === 'todo' && b.completed).length === blocks.filter(b => b.type === 'todo').length && blocks.filter(b => b.type === 'todo').length > 0
              ? 'bg-gradient-to-r from-green-400 to-green-500 ring-2 ring-green-200'
              : blocks.some(b => b.type === 'todo' && b.completed)
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 ring-2 ring-yellow-200'
              : 'bg-gradient-to-r from-gray-300 to-gray-400 ring-2 ring-gray-100'
          }`} />
          <span className="text-xs text-gray-500 font-medium bg-white/80 px-2 py-1 rounded-full">
            {blocks.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default WeekGridItem;