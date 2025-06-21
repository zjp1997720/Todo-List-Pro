import { WeekData } from '../types';

const STORAGE_KEY = 'weekly-planner-data';

export const saveData = (data: WeekData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
};

export const loadData = (): WeekData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('加载数据失败:', error);
    return {};
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};