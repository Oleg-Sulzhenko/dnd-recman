import { useState, memo, type ReactElement, useEffect } from "react";
import { compareObjects } from '../utils/helpers'
import { Column, Id, Task, TasksFilterOptions } from "../types";
import PlusIcon from "../icons/PlusIcon";
import SortableTask from "../containers/SortableTask";


interface Props {
  column: Column
  updateColumn: (id: Id, title: string) => void
  tasks: Task[]
  createTask: (columnId: Id) => void
  updateTask: (id: Id, content: string, completed: boolean) => void
  deleteTask: (id: Id) => void
  filterOptions: TasksFilterOptions
}
const ColumnComponentMemoized = memo(({
  column,
  updateColumn,
  tasks,
  createTask,
  updateTask,
  deleteTask,
  filterOptions
}: Props) => {

  const { completedOnly, todoOnly } = filterOptions;

  const TasksListFilter = (task: Task): ReactElement | null => {
    const sortableTask = <SortableTask key={task.id}
      task={task}
      deleteTask={deleteTask}
      updateTask={updateTask}
    />
    if(completedOnly) {
      if(task.completed) return sortableTask;
    } 
    if(todoOnly) {
      if(!task.completed) return sortableTask;
    } 
    if(!completedOnly && !todoOnly) {
      return sortableTask;
    }
    return null;
  }

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
      <ColumnTitle 
        column={column} 
        tasks={tasks} 
        updateColumn={updateColumn}
        filterOptions={filterOptions}
      />

      {/* Column Tasks container */}
      <div className="flex flex-grow max-h-[334px] flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        {tasks.map((task) => TasksListFilter(task))}
      </div>

      {/* Column footer */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => { createTask(column.id) }}
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.filterOptions === nextProps.filterOptions &&
    prevProps.column === nextProps.column &&
    compareObjects(prevProps.tasks, nextProps.tasks)
  );
})


interface ColumnTitleProps {
  tasks: Task[]
  column: Column
  updateColumn: (id: Id, title: string) => void
  filterOptions: TasksFilterOptions
}
const ColumnTitle = ({ tasks, column, updateColumn, filterOptions }: ColumnTitleProps) => {
  const [editMode, setEditMode] = useState(false);
  const [taskCount, setTaskCount] = useState<number>(0);

  useEffect(() => {
    if(filterOptions.completedOnly) {
      setTaskCount(tasks.filter((task) => task.completed).length);
      return;
    } 
    if(filterOptions.todoOnly) {
      setTaskCount(tasks.filter((task) => !task.completed).length);
      return;
    } 
    if(!filterOptions.todoOnly && !filterOptions.todoOnly) {
      setTaskCount(tasks.length);
      return;
    } 
  }, [tasks, filterOptions]);

  return <div
    onClick={() => { setEditMode(true) }}
    className="
      bg-mainBackgroundColor
      text-md
      h-[60px]
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
      <TaskCounter tasksCount={taskCount}/>

      {!editMode && <p className="
        max-w-[286px]
        whitespace-nowrap text-ellipsis overflow-hidden
        leading-7
      ">{column.title}</p>}
      
      {editMode && (
        <input
          className="
            bg-black 
            focus:border-rose-500 
            border rounded 
            outline-none 
            px-2 
            w-[272px]
          "
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
    {tasksCount || 0}
  </div>
}

export default ColumnComponentMemoized;
