import React from 'react';
import { 
  CheckSquare, 
  Square, 
  FileText, 
  Smile, 
  Clock
} from 'lucide-react';
import { ContentBlock } from '../types';

interface ContentBlockPreviewProps {
  block: ContentBlock;
}

const ContentBlockPreview: React.FC<ContentBlockPreviewProps> = ({ block }) => {
  const getBlockIcon = () => {
    switch (block.type) {
      case 'todo':
        return block.completed ? 
          <CheckSquare className="w-4 h-4 text-green-600" /> : 
          <Square className="w-4 h-4 text-gray-400" />;
      case 'note':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'mood':
        return <Smile className="w-4 h-4 text-yellow-500" />;
      case 'event':
        return <Clock className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getBlockColor = () => {
    switch (block.type) {
      case 'todo':
        return 'border-l-green-400 bg-green-50';
      case 'note':
        return 'border-l-blue-400 bg-blue-50';
      case 'mood':
        return 'border-l-yellow-400 bg-yellow-50';
      case 'event':
        return 'border-l-purple-400 bg-purple-50';
      default:
        return 'border-l-gray-400 bg-gray-50';
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-3 shadow-lg border-l-4 ${getBlockColor()} max-w-xs`}>
      <div className="flex items-center space-x-2">
        {getBlockIcon()}
        <span className={`text-sm font-medium ${
          block.completed ? 'line-through text-gray-500' : 'text-gray-900'
        }`}>
          {block.title}
        </span>
      </div>
      
      {block.type === 'mood' && block.mood && (
        <div className="mt-2 text-center">
          <span className="text-xl">{block.mood}</span>
        </div>
      )}
      
      {block.type === 'event' && (block.startTime || block.endTime) && (
        <div className="mt-2 text-xs text-gray-600">
          {block.startTime && block.endTime
            ? `${block.startTime} - ${block.endTime}`
            : block.startTime || block.endTime}
        </div>
      )}
    </div>
  );
};

export default ContentBlockPreview;