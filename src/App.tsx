import React, { useState, useEffect } from 'react';
import WeekOverview from './components/WeekOverview';
import MonthView from './components/MonthView';
import DayView from './components/DayView';
import InfoPanel from './components/InfoPanel';
import { WeekData, DayData, ContentBlock, ContentType } from './types';
import { getCurrentWeek, formatDate, getWeekRange, getWeekDates } from './utils/dateUtils';
import { saveData, loadData, generateId } from './utils/storage';
import { Calendar, Target, Sparkles, Home, Grid3X3 } from 'lucide-react';

type ViewMode = 'week' | 'month';

function App() {
  const [weekData, setWeekData] = useState<WeekData>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  
  const weekDates = getWeekDates(currentWeekOffset);

  useEffect(() => {
    const data = loadData();
    setWeekData(data);
    
    // 设置默认选中今天
    const today = formatDate(new Date());
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    saveData(weekData);
  }, [weekData]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleBlocksUpdate = (blocks: ContentBlock[]) => {
    const newWeekData = {
      ...weekData,
      [selectedDate]: {
        date: selectedDate,
        blocks
      }
    };
    setWeekData(newWeekData);
  };

  const handleBlockMove = (blockId: string, fromDate: string, toDate: string) => {
    const fromDayData = weekData[fromDate];
    if (!fromDayData) return;

    const blockIndex = fromDayData.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;

    const block = fromDayData.blocks[blockIndex];
    
    // 从原日期移除
    const updatedFromBlocks = fromDayData.blocks.filter(b => b.id !== blockId);
    
    // 添加到目标日期
    const toDayData = weekData[toDate] || { date: toDate, blocks: [] };
    const updatedToBlocks = [...toDayData.blocks, block];

    setWeekData({
      ...weekData,
      [fromDate]: {
        ...fromDayData,
        blocks: updatedFromBlocks
      },
      [toDate]: {
        date: toDate,
        blocks: updatedToBlocks
      }
    });
  };

  const handleAddBlockToDate = (date: string) => {
    // 默认添加待办事项
    const newBlock: ContentBlock = {
      id: generateId(),
      type: 'todo',
      title: '新的待办事项',
      content: '',
      completed: false,
      subtasks: [],
      expanded: false,
      createdAt: Date.now(),
    };

    const dayData = weekData[date] || { date, blocks: [] };
    const updatedBlocks = [...dayData.blocks, newBlock];

    setWeekData({
      ...weekData,
      [date]: {
        date,
        blocks: updatedBlocks
      }
    });

    // 切换到该日期
    setSelectedDate(date);
  };

  const handleWeekNavigation = (direction: 'prev' | 'next') => {
    setCurrentWeekOffset(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  const handleJumpToToday = () => {
    const today = formatDate(new Date());
    setSelectedDate(today);
    setCurrentWeekOffset(0); // 重置到当前周
  };

  const handleViewModeToggle = () => {
    setViewMode(prev => prev === 'week' ? 'month' : 'week');
  };

  const getCurrentDayData = (): DayData => {
    return weekData[selectedDate] || { date: selectedDate, blocks: [] };
  };

  const getSelectedDateObject = (): Date => {
    return new Date(selectedDate + 'T00:00:00');
  };

  const weekRange = getWeekRange(weekDates);
  const currentDayData = getCurrentDayData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">光点计划</h1>
                  <p className="text-blue-100 text-sm">让每一天都闪闪发光</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              {/* 跳转到今天按钮 */}
              <button
                onClick={handleJumpToToday}
                className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>今天</span>
              </button>
              
              {/* 视图切换按钮 */}
              <button
                onClick={handleViewModeToggle}
                className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <Grid3X3 className="w-4 h-4" />
                <span>{viewMode === 'week' ? '月视图' : '周视图'}</span>
              </button>
              
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                <Calendar className="w-4 h-4" />
                <span>{weekRange}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                <Target className="w-4 h-4" />
                <span>
                  {Object.values(weekData).reduce((total, day) => 
                    total + day.blocks.filter(b => b.type === 'todo' && b.completed).length, 0
                  )} 项已完成
                </span>
              </div>
              {/* 周导航按钮 - 只在周视图显示 */}
              {viewMode === 'week' && (
                <div className="flex items-center space-x-1 bg-white/10 px-2 py-2 rounded-lg backdrop-blur-sm">
                  <button
                    onClick={() => handleWeekNavigation('prev')}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <span className="text-lg">←</span>
                  </button>
                  <button
                    onClick={() => handleWeekNavigation('next')}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <span className="text-lg">→</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* 主视图区域 - 占3/5 */}
        <div className="w-3/5">
          {viewMode === 'week' ? (
            <WeekOverview
              weekDates={weekDates}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              weekRange={weekRange}
              weekData={weekData}
              onBlockMove={handleBlockMove}
              onAddBlock={handleAddBlockToDate}
            />
          ) : (
            <MonthView
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              weekData={weekData}
              onBlockMove={handleBlockMove}
              onAddBlock={handleAddBlockToDate}
            />
          )}
        </div>
        
        {/* 日视图 - 占1/5 */}
        <div className="w-1/5">
          <DayView
            date={getSelectedDateObject()}
            blocks={currentDayData.blocks}
            onBlocksUpdate={handleBlocksUpdate}
          />
        </div>
        
        {/* 信息面板 - 占1/5 */}
        <div className="w-1/5">
          <InfoPanel
            blocks={currentDayData.blocks}
            selectedDate={getSelectedDateObject()}
          />
        </div>
      </div>
    </div>
  );
}

export default App;