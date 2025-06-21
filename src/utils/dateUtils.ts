export const getCurrentWeek = (): Date[] => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  
  const week = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    week.push(date);
  }
  return week;
};

export const getWeekDates = (weekOffset: number = 0): Date[] => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));
  
  const week = [];
  for (let i = 0; i < 9; i++) { // 扩展到9天，包含下周一和下周二
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    week.push(date);
  }
  return week;
};

export const getMonthDates = (monthOffset: number = 0): Date[] => {
  const today = new Date();
  const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  
  // 获取月份的第一天是星期几（0=周日, 1=周一, ...）
  const firstDayOfMonth = targetMonth.getDay();
  
  // 获取月份的最后一天
  const lastDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
  
  // 计算需要显示的开始日期（包含上个月的日期）
  const startDate = new Date(targetMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth);
  
  // 生成42天的日期数组（6周 x 7天）
  const dates = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDisplayDate = (date: Date): string => {
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${date.getDate()} ${weekDays[date.getDay()]}`;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const getWeekRange = (dates: Date[]): string => {
  if (dates.length === 0) return '';
  const start = dates[0];
  const end = dates[6]; // 只显示到周日
  return `第${getWeekNumber(start)}周 ${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
};

const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};