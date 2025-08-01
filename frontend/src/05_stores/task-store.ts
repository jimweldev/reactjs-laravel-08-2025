import { create } from 'zustand';
import type { Task } from '@/04_types/task';

// Define the store
type TaskStoreProps = {
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
};

// Create the store
const useTaskStore = create<TaskStoreProps>(set => ({
  selectedTask: null,
  setSelectedTask: task => set({ selectedTask: task }),
}));

export default useTaskStore;
