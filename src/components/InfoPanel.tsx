import React from 'react';
import { TrendingUp, Target, Calendar, CheckCircle } from 'lucide-react';
import { ContentBlock } from '../types';

interface InfoPanelProps {
  blocks: ContentBlock[];
  selectedDate: Date;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ blocks, selectedDate }) => {
  const todoBlocks = blocks.filter(block => block.type === 'todo');
  const completedTodos = todoBlocks.filter(block => block.completed);
  const completionRate = todoBlocks.length > 0 ? (completedTodos.length / todoBlocks.length) * 100 : 0;
  
  const moodBlocks = blocks.filter(block => block.type === 'mood');
  const eventBlocks = blocks.filter(block => block.type === 'event');
  const noteBlocks = blocks.filter(block => block.type === 'note');

  const stats = [
    {
      label: '待办事项',
      value: `${completedTodos.length}/${todoBlocks.length}`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: '完成率',
      value: `${Math.round(completionRate)}%`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: '事件数',
      value: eventBlocks.length.toString(),
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: '笔记数',
      value: noteBlocks.length.toString(),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="h-full bg-white p-4 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">今日统计</h3>
        
        <div className="grid grid-cols-1 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className={`p-3 rounded-lg ${stat.bgColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-sm font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 今日心情 */}
      {moodBlocks.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">今日心情</h4>
          <div className="space-y-2">
            {moodBlocks.map((mood) => (
              <div key={mood.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <span className="text-lg">{mood.mood}</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-900">{mood.title}</p>
                  {mood.content && (
                    <p className="text-xs text-gray-600 mt-1">{mood.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 今日事件 */}
      {eventBlocks.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">今日事件</h4>
          <div className="space-y-2">
            {eventBlocks.map((event) => (
              <div key={event.id} className="p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-900">{event.title}</p>
                {(event.startTime || event.endTime) && (
                  <p className="text-xs text-gray-600 mt-1">
                    {event.startTime && event.endTime
                      ? `${event.startTime} - ${event.endTime}`
                      : event.startTime || event.endTime}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用提示 */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="text-xs font-medium text-blue-900 mb-2">💡 使用提示</h4>
        <p className="text-xs text-blue-700">
          拖拽项目可以重新排序，点击标题可以快速编辑内容。
        </p>
      </div>
    </div>
  );
};

export default InfoPanel;