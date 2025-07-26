import { create } from 'zustand';
import type { Task } from '@/04_types/task';

// Define the store
type TaskStoreProps = {
  selectedTask: Task | null;
  isOpenCreateTaskDialog: boolean;
  isOpenUpdateTaskDialog: boolean;
  isOpenDeleteTaskDialog: boolean;
  setSelectedTask: (task: Task | null) => void;
  setIsOpenCreateTaskDialog: (isOpen: boolean) => void;
  setIsOpenUpdateTaskDialog: (isOpen: boolean) => void;
  setIsOpenDeleteTaskDialog: (isOpen: boolean) => void;
  reset: () => void;
};

// Initial state
const initialState = {
  selectedTask: null,
  isOpenUpdateTaskDialog: false,
  isOpenDeleteTaskDialog: false,
  isOpenCreateTaskDialog: false,
};

// Create the store
const useTaskStore = create<TaskStoreProps>(set => ({
  selectedTask: null,
  isOpenCreateTaskDialog: false,
  isOpenUpdateTaskDialog: false,
  isOpenDeleteTaskDialog: false,
  setSelectedTask: task => set({ selectedTask: task }),
  setIsOpenCreateTaskDialog: isOpen => set({ isOpenCreateTaskDialog: isOpen }),
  setIsOpenUpdateTaskDialog: isOpen => set({ isOpenUpdateTaskDialog: isOpen }),
  setIsOpenDeleteTaskDialog: isOpen => set({ isOpenDeleteTaskDialog: isOpen }),
  reset: () => set(initialState),
}));

export default useTaskStore;
