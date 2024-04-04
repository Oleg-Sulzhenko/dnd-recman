import { useState, memo } from "react";
import TrashIcon from "../icons/TrashIcon";
import { TaskCardProps } from "../types";
import Checkbox from "./ui/Checkbox";

const TaskCard = memo(({ task, updateTask, deleteTask }: TaskCardProps) => {
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  if (editMode) {
    return (
      <div
        className="
          items-center flex text-left 
          h-[100px] min-h-[100px] 
          bg-mainBackgroundColor 
          p-2.5 
          rounded-xl hover:ring-2 
          cursor-grab 
          relative
        "
      >
        <textarea
          className="
            h-[90%]
            w-full 
            resize-none 
            border-none 
            rounded 
            bg-transparent
            text-white 
            focus:outline-none
          "
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value, task.completed)}
        />
      </div>
    );
  }

  const toggleCompleted = () => {
    const { id, content, completed } = task;
    updateTask(id, content, !completed);
  }

  console.log('[Task] ', task.content)

  return (
      <div
        className={`
          bg-mainBackgroundColor 
          pl-12
          pr-14
          p-2.5 
          h-[100px] 
          min-h-[100px] 
          items-center 
          flex 
          text-left 
          rounded-xl 
          hover:ring-2 hover:ring-inset hover:ring-rose-500 
          cursor-grab relative
          ${task.completed ? `
            ring-2 ring-inset ring-lime-800
            bg-lime-950
          ` : "" }
        `}
      > 
      
        <span className="absolute left-3 top-4">
          <Checkbox value={task.completed} onChange={toggleCompleted}/>
        </span>

        <p 
          onClick={toggleEditMode} 
          className="
            my-auto h-[90%] 
            w-full 
            overflow-y-auto 
            overflow-x-hidden 
            whitespace-pre-wrap 
            pr-1
          "
        >
          {task.content}
        </p>

        <button
          onClick={() => { deleteTask(task.id) }}
          className="
            absolute 
            right-3 
            top-1/2 -translate-y-1/2
            bg-columnBackgroundColor 
            stroke-white 
            p-2 
            rounded 
            opacity-60 
            hover:opacity-100
          "
        >
          <TrashIcon />
        </button>
  
      </div>
  );
})

export default TaskCard;
