import { useMemo, useState, memo } from "react";
import { SortableContext } from "@dnd-kit/sortable";

import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  updateColumn: (id: Id, title: string) => void;
  // tasks: Task[];
  // createTask: (columnId: Id) => void;
  // updateTask: (id: Id, content: string) => void;
  // deleteTask: (id: Id) => void;
}
const ColumnContainerMemoized = memo(function ColumnContainer({
  column,
  updateColumn,
  // tasks,
  // createTask,
  // updateTask,
  // deleteTask,
}: Props) {

  // const tasksIds = useMemo(() => {
  //   return tasks.map((task) => task.id);
  // }, [tasks]);

  console.log('[COL] ', column.title)

  return (
    <div
      className="
        bg-columnBackgroundColor
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        flex
        flex-col
      "
    >
      {/* Column title */}
    {/* <ColumnTitle column={column} tasks={tasks} updateColumn={updateColumn}/> */}
    <ColumnTitle column={column} updateColumn={updateColumn}/>

      {/* Column Tasks container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        {/* <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext> */}

        {/* {tasks.map((task) => (
          <TaskCardOptimized
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        ))} */}

      </div>

      {/* Column footer */}
      {/* <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => { createTask(column.id) }}
      >
        <PlusIcon />
        Add task
      </button> */}
    </div>
  );
})




interface ColumnTitleProps {
  // tasks: Task[]
  column: Column
  updateColumn: (id: Id, title: string) => void
}
const ColumnTitle = ({  column, updateColumn }: ColumnTitleProps) => {
  const [editMode, setEditMode] = useState(false);

  return <div
    onClick={() => { setEditMode(true) }}
    className="
      bg-mainBackgroundColor
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-3
      font-bold
      border-columnBackgroundColor
      border-4
      flex
      items-center
      justify-between
    "
  >
    <div className="flex gap-2">
      {/* <TaskCounter tasksCount={tasks?.length}/> */}

      {!editMode && column.title}
      
      {editMode && (
        <input
          className="bg-black focus:border-rose-500 border rounded outline-none px-2"
          value={column.title}
          onChange={(e) => updateColumn(column.id, e.target.value)}
          autoFocus
          onBlur={() => {
            setEditMode(false);
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            setEditMode(false);
          }}
        />
      )}
    </div>

  </div> 
}

const TaskCounter = ({ tasksCount }: { tasksCount: number }) => {
  return <div
    className="flex justify-center items-center
      bg-columnBackgroundColor
      px-2 py-1
      text-sm
      rounded-full
    "
  >
    {tasksCount}
  </div>
}

export default ColumnContainerMemoized;
