import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Id, Task } from "../types";
import TaskCard from "../components/TaskCard";

interface Props { 
  task: Task;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
}
function SortableTask (props: Props) {
  const { task, updateTask, deleteTask } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    // disabled: editMode,
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
          opacity-30
          bg-mainBackgroundColor 
          p-2.5 
          h-[100px] 
          min-h-[100px] 
          items-center 
          flex 
          text-left 
          rounded-xl 
          border-2 
          border-rose-500  
          cursor-grab relative
        "
      />
    );
  }

  // console.log('SortableTask', task.content)

  return (
    <div ref={setNodeRef} style={style}
      {...attributes}
      {...listeners} 
      className="
        bg-columnBackgroundColor
        rounded-md
        flex
        flex-col
        overflow-hidden
        h-[100px] 
        min-h-[100px] 
      "
    >
     <TaskCard task={task} updateTask={updateTask} deleteTask={deleteTask}/>
    </div>
  );
}

export default SortableTask;