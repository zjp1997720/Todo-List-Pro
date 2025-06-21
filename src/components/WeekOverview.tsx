import React from 'react';
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
import { ContentBlock, WeekData } from '../types';
import WeekGridItem from './WeekGridItem';
import ContentBlockPreview from './ContentBlockPreview';

interface WeekOverviewProps {
  weekDates: Date[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  weekRange: string;
  weekData: WeekData;
  onBlockMove: (blockId: string, fromDate: string, toDate: string) => void;
  onAddBlock: (date: string) => void;
}

const WeekOverview: React.FC<WeekOverviewProps> = ({
  weekDates,
  selectedDate,
  onDateSelect,
  weekRange,
  weekData,
  onBlockMove,
  onAddBlock
}) => {
  const [activeBlock, setActiveBlock] = React.useState<ContentBlock | null>(null);
  const [dragFromDate, setDragFromDate] = React.useState<string>('');

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const blockId = active.id as string;
    
    // 找到被拖拽的块和它所在的日期
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
      
      // 检查是否拖拽到了日期容器
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

  // 获取所有可拖拽的项目ID
  const getAllBlockIds = () => {
    const ids: string[] = [];
    Object.values(weekData).forEach(dayData => {
      dayData.blocks.forEach(block => {
        ids.push(block.id);
      });
    });
    return ids;
  };

  // 创建3x3网格，包含7天日期 + 下周一和下周二
  const createGridItems = () => {
    const items = [];
    
    // 添加9天的日期（本周7天 + 下周一和下周二）
    weekDates.forEach((date, index) => {
      const dateStr = date.toISOString().split('T')[0];
      const isSelected = selectedDate === dateStr;
      const isTodayDate = isToday(date);
      const dayData = weekData[dateStr];
      const blocks = dayData?.blocks || [];
      
      items.push(
        <WeekGridItem
          key={dateStr}
          date={date}
          dateStr={dateStr}
          isSelected={isSelected}
          isToday={isTodayDate}
          blocks={blocks}
          onDateSelect={onDateSelect}
          onAddBlock={onAddBlock}
        />
      );
    });

    return items;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 p-6 overflow-y-auto flex flex-col">
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
          {/* 3x3 网格布局 - 占据更多高度 */}
          <div className="grid grid-cols-3 gap-6 flex-1 min-h-[600px]">
            {createGridItems()}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeBlock ? (
            <ContentBlockPreview block={activeBlock} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* 周概览信息 - 移到底部 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-base font-medium text-gray-900 mb-3">本周概览</h3>
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

export default WeekOverview;