import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";


interface Props { 
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

export function Sortable(props: Props) {
  const { column, tasks, deleteColumn, updateColumn, createTask, deleteTask, updateTask } = props;

  const { setNodeRef, listeners, transform, transition, attributes, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    // disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const Item = memo(ColumnContainer);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
          bg-columnBackgroundColor
          opacity-40
          border-2
          border-pink-500
          w-[350px]
          h-[500px]
          max-h-[500px]
          rounded-md
          flex
          flex-col
        "
      ></div>
    );
  }

  return (
    <div ref={setNodeRef}    style={style}       
    className="
      bg-columnBackgroundColor
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
    ">
      <div {...listeners} {...attributes}>
        Draggable ZOne
      </div>
      <Item 
          column={column}

          deleteColumn={deleteColumn}
          updateColumn={updateColumn}

          createTask={createTask}
          deleteTask={deleteTask}
          updateTask={updateTask}
          tasks={tasks.filter((task) => task.columnId === column.id)}
        />
    </div>
  );
}