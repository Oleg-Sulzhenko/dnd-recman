import { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import DraggableIcon from "../icons/DraggableIcon";
import TrashIcon from "../icons/TrashIcon";

interface Props { 
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  // createTask: (columnId: Id) => void;
  // updateTask: (id: Id, content: string) => void;
  // deleteTask: (id: Id) => void;
  tasks: Task[];
}
function SortableColumn (props: Props) {
  const { 
    column, deleteColumn, updateColumn, 
    tasks, 
    // createTask, deleteTask, updateTask
  } = props;

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

  const memoizedColumnContainer = useMemo(() => {
    return <ColumnContainer 
      column={column} 
      updateColumn={updateColumn}
      
      // createTask={createTask}
      // updateTask={updateTask}
      // deleteTask={deleteTask}
      // tasks={tasks.filter((task) => task.columnId === column.id)}
    />;
  }, [column, updateColumn, tasks]);

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

  // console.log('SortableColumn', column.title)

  return (
    <div ref={setNodeRef} style={style}       
      className="
        bg-columnBackgroundColor
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        flex
        flex-col
        overflow-hidden
      "
    >
      <div {...listeners} {...attributes} 
        className="
          flex justify-between items-center 
          bg-slate-800 hover:bg-slate-700
          mb-1
          pr-1
        "
       >
        <DraggableIcon/>

        <button
          onClick={() => { deleteColumn(column.id) }}
          className="
            stroke-gray-500
            hover:stroke-white
            rounded
            px-1
            py-2
          "
        >
          <TrashIcon />
        </button>
      </div>

      {/* Column Content */}
      { memoizedColumnContainer }

    </div>
  );
}

export default SortableColumn;