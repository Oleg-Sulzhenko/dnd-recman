import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Id, Task, TasksFilterOptions } from "../types";
import ColumnComponent from "../components/Column";
import DraggableIcon from "../icons/DraggableIcon";
import TrashIcon from "../icons/TrashIcon";

interface Props { 
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string, completed: boolean) => void;
  deleteTask: (id: Id) => void;
  columnTasks: Task[];
  filterOptions: TasksFilterOptions;
}
function SortableColumn (props: Props) {
  const { column, deleteColumn, columnTasks, ...restProps } = props;

  const { setNodeRef, listeners, transform, transition, attributes, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

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
      {/* Draggable Top */}
      <div {...listeners} {...attributes} 
        className="
          bg-slate-800 
          flex justify-between items-center 
          mb-1
          pr-1
          hover:bg-slate-700
          cursor-grab
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

      {/* Column Component */}
      <ColumnComponent 
        column={column} 
        tasks={columnTasks}
        {...restProps}
      />
    </div>
  );
}

export default SortableColumn;