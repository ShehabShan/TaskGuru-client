/* eslint-disable react/prop-types */
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";


const TaskColumn = ({ title, tasks, onUpdateTask, onDeleteTask }) => {
  const { setNodeRef } = useDroppable({ id: title });

  return (
    <div ref={setNodeRef} className="bg-muted/50 rounded-lg p-4">
      <h2 className="font-semibold mb-4">{title}</h2>
      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default TaskColumn;
