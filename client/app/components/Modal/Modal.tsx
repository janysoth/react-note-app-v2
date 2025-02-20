"use client"
import { useTasks } from '@/context/taskContext';
import useDetectOutside from '@/hooks/useDetectOutside';
import React, { useEffect, useRef } from 'react';

const Modal = () => {
  const {
    task,
    handleInput,
    createTask,
    isEditing,
    closeModal,
    modalMode,
    activeTask,
    updateTask,
  } = useTasks();

  const ref = useRef(null);

  // To Detect Click outside the modal
  useDetectOutside({
    ref,
    callback: () => {
      if (isEditing) {
        closeModal();
      }
    },
  });

  useEffect(() => {
    if (modalMode === "edit" && activeTask)
      handleInput("setTask")(activeTask);
  }, [modalMode, activeTask]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (modalMode === "edit")
      updateTask(task);
    else if (modalMode === "add")
      createTask(task);

    closeModal();
  };

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-[#333]/30 overflow-hidden">
      <form
        className="py-5 px-6 max-w-[520px] w-full flex flex-col gap-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md"
        onSubmit={handleSubmit}
        ref={ref}
      >
        {/* Close (X) Button */}
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Title Input */}
        <div className='flex flex-col gap-1'>
          <label htmlFor="title">Title</label>
          <input
            className="bg-[#F9F9F9] p-2 rounded-md border"
            type="text"
            id="title"
            placeholder="Task Title"
            name="title"
            value={task.title || ""}
            onChange={(e) => handleInput("title")(e)}
          />
        </div>

        {/* Description Input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description">Description</label>
          <textarea
            className="bg-[#F9F9F9] p-2 rounded-md border resize-none"
            name="description"
            placeholder="Task Description"
            rows={4}
            value={task.description || ""}
            onChange={(e) => handleInput("description")(e)}
          />
        </div>

        {/* Priority Input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="priority">Select Priority</label>
          <select
            className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
            name="priority"
            value={task.priority || ""}
            onChange={(e) => handleInput("priority")(e)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Due Date Input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="dueDate">Due Date</label>
          <input
            className="bg-[#F9F9F9] p-2 rounded-md border"
            type="date"
            name="dueDate"
            value={task.dueDate ? task.dueDate.split('T')[0] : ""}
            onChange={(e) => handleInput("dueDate")(e)}
          />
        </div>

        {/* Status Input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="completed">Task Completed</label>
          <div className="flex items-center justify-between bg-[#F9F9F9] p-2 rounded-md border">
            <label htmlFor="completed">Completed</label>
            <select
              className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
              name="completed"
              value={task.completed || ""}
              onChange={(e) => handleInput("completed")(e)}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>

        {/* Buttons: Submit & Cancel */}
        <div className="mt-4 flex justify-between gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="w-1/2 py-3 border border-gray-300 rounded-full bg-red-500 text-white hover:bg-red-700 transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`w-1/2 text-white py-3 hover:bg-blue-500 transition duration-200 rounded-full ${modalMode === "edit" ? "bg-blue-400" : "bg-[#3aafae]"}`}
          >
            {modalMode === "edit" ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Modal;