/* eslint-disable react/prop-types */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip, Trash } from "lucide-react";

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background border rounded shadow-sm"
    >
      <div className="p-4 flex flex-row items-start justify-between">
        <div className="flex-1 pr-2">
          <div className="text-base font-semibold">{task.title}</div>
          {task.description && (
            <div className="mt-1 text-sm text-gray-500">{task.description}</div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <Grip className="w-4 h-4" />
          </button>
          <button
            className="text-destructive"
            onClick={() => onDelete(task._id)}
          >
            <Trash className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
