import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  CheckSquare, 
  Square, 
  FileText, 
  Smile, 
  Clock,
  GripVertical
} from 'lucide-react';
import { ContentBlock } from '../types';

interface WeekBlockItemProps {
  block: ContentBlock;
  compact?: boolean;
}

const WeekBlockItem: React.FC<WeekBlockItemProps> = ({ block, compact = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getBlockIcon = () => {
    const iconSize = compact ? 'w-3 h-3' : 'w-4 h-4';
    switch (block.type) {
      case 'todo':
        return block.completed ? 
          <CheckSquare className={`${iconSize} text-green-600`} /> : 
          <Square className={`${iconSize} text-gray-400`} />;
      case 'note':
        return <FileText className={`${iconSize} text-blue-500`} />;
      case 'mood':
        return <Smile className={`${iconSize} text-yellow-500`} />;
      case 'event':
        return <Clock className={`${iconSize} text-purple-500`} />;
      default:
        return null;
    }
  };

  const getBlockColor = () => {
    switch (block.type) {
      case 'todo':
        return block.completed ? 'bg-green-100 border-green-200' : 'bg-white border-green-200';
      case 'note':
        return 'bg-blue-50 border-blue-200';
      case 'mood':
        return 'bg-yellow-50 border-yellow-200';
      case 'event':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`px-2 py-1.5 rounded border text-xs cursor-grab active:cursor-grabbing ${getBlockColor()} hover:shadow-sm transition-all group`}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center space-x-1.5">
          {getBlockIcon()}
          <span className={`flex-1 truncate text-xs ${
            block.completed ? 'line-through text-gray-500' : 'text-gray-700'
          }`}>
            {block.title.length > 12 ? block.title.substring(0, 12) + '...' : block.title}
          </span>
          {/* 显示额外信息 */}
          {block.type === 'mood' && block.mood && (
            <span className="text-xs">{block.mood}</span>
          )}
          {block.type === 'event' && block.startTime && (
            <span className="text-xs text-gray-500">{block.startTime}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded border text-sm cursor-grab active:cursor-grabbing ${getBlockColor()} hover:shadow-sm transition-all group`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center space-x-2">
        <GripVertical className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        {getBlockIcon()}
        <span className={`flex-1 truncate ${
          block.completed ? 'line-through text-gray-500' : 'text-gray-700'
        }`}>
          {block.title}
        </span>
      </div>
      
      {/* 显示额外信息 */}
      {block.type === 'mood' && block.mood && (
        <div className="mt-2 text-center">
          <span className="text-lg">{block.mood}</span>
        </div>
      )}
      
      {block.type === 'event' && (block.startTime || block.endTime) && (
        <div className="mt-2 text-xs text-gray-500">
          {block.startTime && block.endTime
            ? `${block.startTime}-${block.endTime}`
            : block.startTime || block.endTime}
        </div>
      )}
      
      {block.type === 'todo' && block.subtasks && block.subtasks.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {block.subtasks.filter(t => t.completed).length}/{block.subtasks.length} 子任务
        </div>
      )}
    </div>
  );
};

export default WeekBlockItem;