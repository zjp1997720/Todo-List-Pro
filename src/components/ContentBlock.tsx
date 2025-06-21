import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  CheckSquare, 
  Square, 
  FileText, 
  Smile, 
  Clock, 
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { ContentBlock as ContentBlockType, SubTask } from '../types';

interface ContentBlockProps {
  block: ContentBlockType;
  onUpdate: (block: ContentBlockType) => void;
  onDelete: (blockId: string) => void;
}

const ContentBlock: React.FC<ContentBlockProps> = ({ block, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [showMoodPicker, setShowMoodPicker] = useState(false);

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

  const moods = ['😊', '😔', '😴', '😤', '🤔', '😍', '😎', '🤗', '😂', '😭'];

  const handleTitleChange = (value: string) => {
    onUpdate({ ...block, title: value });
  };

  const handleContentChange = (value: string) => {
    onUpdate({ ...block, content: value });
  };

  const handleToggleComplete = () => {
    onUpdate({ ...block, completed: !block.completed });
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    const updatedSubtasks = block.subtasks?.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    onUpdate({ ...block, subtasks: updatedSubtasks });
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const newSubtaskObj: SubTask = {
        id: Date.now().toString(),
        title: newSubtask,
        completed: false
      };
      const updatedSubtasks = [...(block.subtasks || []), newSubtaskObj];
      onUpdate({ ...block, subtasks: updatedSubtasks });
      setNewSubtask('');
    }
  };

  const handleMoodSelect = (mood: string) => {
    onUpdate({ ...block, mood });
    setShowMoodPicker(false);
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    onUpdate({ ...block, [field]: value });
  };

  const toggleExpanded = () => {
    onUpdate({ ...block, expanded: !block.expanded });
  };

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
        return 'border-l-green-400';
      case 'note':
        return 'border-l-blue-400';
      case 'mood':
        return 'border-l-yellow-400';
      case 'event':
        return 'border-l-purple-400';
      default:
        return 'border-l-gray-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow border-l-4 ${getBlockColor()}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing mt-1"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {block.type === 'todo' && (
                <button onClick={handleToggleComplete}>
                  {getBlockIcon()}
                </button>
              )}
              {block.type !== 'todo' && getBlockIcon()}
              
              {isEditing ? (
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                  className="flex-1 text-sm font-medium border-none outline-none bg-transparent"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => setIsEditing(true)}
                  className={`flex-1 text-sm font-medium cursor-pointer ${
                    block.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {block.title}
                </span>
              )}
            </div>

            {/* 心情显示 */}
            {block.type === 'mood' && (
              <div className="mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{block.mood || '😊'}</span>
                  <button
                    onClick={() => setShowMoodPicker(!showMoodPicker)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    更换心情
                  </button>
                </div>
                {showMoodPicker && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {moods.map((mood) => (
                        <button
                          key={mood}
                          onClick={() => handleMoodSelect(mood)}
                          className="text-xl hover:bg-gray-200 p-1 rounded"
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 事件时间 */}
            {block.type === 'event' && (
              <div className="mb-2 flex items-center space-x-2">
                <input
                  type="time"
                  value={block.startTime || ''}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                />
                <span className="text-xs text-gray-500">至</span>
                <input
                  type="time"
                  value={block.endTime || ''}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                />
              </div>
            )}

            {/* 内容区域 */}
            {(block.type === 'note' || block.type === 'mood') && (
              <div className="mb-2">
                <textarea
                  value={block.content || ''}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder={block.type === 'note' ? '添加笔记内容...' : '记录心情...'}
                  className="w-full text-sm text-gray-600 border-none outline-none resize-none bg-transparent"
                  rows={block.expanded ? 4 : 2}
                />
              </div>
            )}

            {/* 子任务 */}
            {block.type === 'todo' && (
              <div className="ml-6">
                {block.subtasks?.map((subtask) => (
                  <div key={subtask.id} className="flex items-center space-x-2 mb-1">
                    <button
                      onClick={() => handleSubtaskToggle(subtask.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {subtask.completed ? 
                        <CheckSquare className="w-3 h-3" /> : 
                        <Square className="w-3 h-3" />
                      }
                    </button>
                    <span className={`text-xs ${
                      subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'
                    }`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
                
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                    placeholder="添加子任务..."
                    className="flex-1 text-xs border-none outline-none bg-transparent text-gray-600"
                  />
                  {newSubtask && (
                    <button
                      onClick={handleAddSubtask}
                      className="text-green-500 hover:text-green-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {(block.type === 'note' || block.type === 'mood') && (
            <button
              onClick={toggleExpanded}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {block.expanded ? 
                <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                <ChevronRight className="w-4 h-4 text-gray-400" />
              }
            </button>
          )}
          <button
            onClick={() => onDelete(block.id)}
            className="p-1 hover:bg-red-100 hover:text-red-600 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentBlock;