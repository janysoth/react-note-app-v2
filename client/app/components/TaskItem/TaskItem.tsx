import { useTasks } from '@/context/taskContext';
import { edit, star, trash } from "@/utils/Icons";
import { Task } from '@/utils/types';
import { formatDueDate, formatTime } from '@/utils/utilities';
import React from 'react';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case 'low':
        return { text: "text-green-500", border: "border-green-500" };
      case "medium":
        return { text: "text-yellow-500", border: "border-yellow-500" };
      case "high":
        return { text: "text-red-500", border: "border-red-500" };
      default:
        return { text: "text-red-500", border: "border-red-500" };
    }
  };

  const { text, border } = getPriorityClasses(task.priority);
  const { getTask, deleteTask, openModalForEdit, modalMode, toggleComplete } = useTasks();

  // Determine if the due date is within 2 days
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to midnight local time

  const dueDate = new Date(task.dueDate);
  dueDate.setUTCHours(0, 0, 0, 0); // Ensure dueDate remains in UTC

  const timeDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const dueDateStyle = timeDiff <= 2 ? "text-red-500 font-bold" : "text-gray-400";

  // Additional styling for completed tasks
  const completedDueDateStyle = "line-through text-green-500";

  return (
    <div className={`h-[16rem] px-4 py-3 flex flex-col gap-4 shadow-sm bg-[#f9f9f9] rounded-lg border-2 hover:bg-gray-200 ${border} ${text}`}>
      {/* Header with Due Date */}
      <div className="flex justify-between">
        <h4 className="font-bold text-2xl">{task.title}</h4>
        <p className={`text-sm ${task.completed ? completedDueDateStyle : dueDateStyle}`}>
          Due: {formatDueDate(task.dueDate)}
        </p>
      </div>

      <p>{task.description}</p>

      <div className='mt-auto flex justify-between items-center'>
        <p className={`text-sm text-gray-400 ${text}`}>
          {formatTime(task.createdAt)}
        </p>

        <p className={`text-sm font-bold ${text}`}>
          {task.priority.toUpperCase()}
        </p>

        <div>
          <div className='flex items-center gap-3 text-gray-400 text-[1.2rem]'>
            {/* Complete Task */}
            <button
              className={
                `${task.completed ? "text-yellow-400" : "text-gray-400"}`
              }
              onClick={() => toggleComplete(task)}
            >
              {star}
            </button>

            {/* Edit Task */}
            <button
              className="text-[#00A1F1]"
              onClick={() => {
                getTask(task._id);
                openModalForEdit(task);
              }}
            >
              {edit}
            </button>

            {/* Delete Task */}
            <button
              className="text-[#F65314]"
              onClick={() => {
                deleteTask(task._id);
              }}
            >
              {trash}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskItem;