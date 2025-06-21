import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentBlock, WeekData } from '../types';
import MonthGridItem from './MonthGridItem';
import ContentBlockPreview from './ContentBlockPreview';
import { getMonthDates, formatDate, isToday } from '../utils/dateUtils';

interface MonthViewProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  weekData: WeekData;
  onBlockMove: (blockId: string, fromDate: string, toDate: string) => void;
  onAddBlock: (date: string) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  selectedDate,
  onDateSelect,
  weekData,
  onBlockMove,
  onAddBlock
}) => {
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
  const [activeBlock, setActiveBlock] = useState<ContentBlock | null>(null);
  const [dragFromDate, setDragFromDate] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const monthDates = getMonthDates(currentMonthOffset);
  const currentMonth = new Date();
  currentMonth.setMonth(currentMonth.getMonth() + currentMonthOffset);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const blockId = active.id as string;
    
    let foundBlock: ContentBlock | null = null;
    let foundDate = '';
    
    for (const [date, dayData] of Object.entries(weekData)) {
      const block = dayData.blocks.find(b => b.id === blockId);
      if (block) {
        foundBlock = block;
        foundDate = date;
        break;
      }
    }
    
    if (foundBlock) {
      setActiveBlock(foundBlock);
      setDragFromDate(foundDate);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && activeBlock && dragFromDate) {
      const overId = over.id as string;
      
      if (overId.startsWith('date-')) {
        const toDate = overId.replace('date-', '');
        if (toDate !== dragFromDate) {
          onBlockMove(activeBlock.id, dragFromDate, toDate);
        }
      }
    }
    
    setActiveBlock(null);
    setDragFromDate('');
  };

  const getAllBlockIds = () => {
    const ids: string[] = [];
    Object.values(weekData).forEach(dayData => {
      dayData.blocks.forEach(block => {
        ids.push(block.id);
      });
    });
    return ids;
  };

  const handleMonthNavigation = (direction: 'prev' | 'next') => {
    setCurrentMonthOffset(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  return (
    <div className="h-full bg-white border-r border-gray-200 p-6 overflow-y-auto flex flex-col">
      {/* 月份导航 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleMonthNavigation('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => handleMonthNavigation('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={getAllBlockIds()}
          strategy={rectSortingStrategy}
        >
          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* 月份网格 */}
          <div className="grid grid-cols-7 gap-2 flex-1">
            {monthDates.map((date) => {
              const dateStr = formatDate(date);
              const isSelected = selectedDate === dateStr;
              const isTodayDate = isToday(date);
              const dayData = weekData[dateStr];
              const blocks = dayData?.blocks || [];
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

              return (
                <MonthGridItem
                  key={dateStr}
                  date={date}
                  dateStr={dateStr}
                  isSelected={isSelected}
                  isToday={isTodayDate}
                  isCurrentMonth={isCurrentMonth}
                  blocks={blocks}
                  onDateSelect={onDateSelect}
                  onAddBlock={onAddBlock}
                />
              );
            })}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeBlock ? (
            <ContentBlockPreview block={activeBlock} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* 月概览信息 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-base font-medium text-gray-900 mb-3">本月概览</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between items-center p-2 bg-white rounded">
            <span className="text-gray-600">待办事项:</span>
            <span className="font-semibold text-gray-900">
              {Object.values(weekData).reduce((total, day) => 
                total + day.blocks.filter(b => b.type === 'todo').length, 0
              )}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white rounded">
            <span className="text-gray-600">已完成:</span>
            <span className="font-semibold text-green-600">
              {Object.values(weekData).reduce((total, day) => 
                total + day.blocks.filter(b => b.type === 'todo' && b.completed).length, 0
              )}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white rounded">
            <span className="text-gray-600">事件:</span>
            <span className="font-semibold text-purple-600">
              {Object.values(weekData).reduce((total, day) => 
                total + day.blocks.filter(b => b.type === 'event').length, 0
              )}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white rounded">
            <span className="text-gray-600">笔记:</span>
            <span className="font-semibold text-blue-600">
              {Object.values(weekData).reduce((total, day) => 
                total + day.blocks.filter(b => b.type === 'note').length, 0
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthView;