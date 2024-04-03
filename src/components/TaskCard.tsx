import { useState, memo } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";
import Checkbox from "./ui/Checkbox";


interface Props { 
  task: Task;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
}
const TaskCard = memo(({ task, updateTask, deleteTask }: Props) => {
  // const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    // setMouseIsOver(false);
  };

  if (editMode) {
    return (
      <div
        className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      >
        <textarea
          className="
            h-[90%]
            w-full resize-none border-none rounded bg-transparent text-white focus:outline-none
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
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  // const toggleCompleted = () => {
  //   updateTask(task.id, {completed: task.completed})
  // }

  console.log('[Task] ', task.content)

  return (
    <div
      onClick={toggleEditMode}
      className="
        bg-mainBackgroundColor 
        p-2.5 
        h-[100px] 
        min-h-[100px] 
        items-center 
        flex 
        text-left 
        rounded-xl 
        hover:ring-2 hover:ring-inset hover:ring-rose-500 
        cursor-grab relative
      "
      // onMouseEnter={() => {
      //   setMouseIsOver(true);
      // }}
      // onMouseLeave={() => {
      //   setMouseIsOver(false);
      // }}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>

       <button
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          {/* <Checkbox value={task.completed} onChange={toggleCompleted}/> */}
        </button>

      {/* {mouseIsOver && ( */}
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          <TrashIcon />
        </button>
      {/* )} */}
    </div>
  );
})

export default TaskCard;
