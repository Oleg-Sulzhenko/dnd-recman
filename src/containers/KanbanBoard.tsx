import { useMemo, useState, memo, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import SortableColumn  from "./SortableColumn";
import TaskCard from "../components/TaskCard";
import Radio from "../components/ui/Radio";
import useLocalStorage from "../hooks/useLocalStorage";
import { defaultCols, defaultTasks } from "../dummyData";


function KanbanBoard() {
  console.log('<<<KANBAN>>>')
  const [columns, setColumns] = useLocalStorage<Column[]>('columns', defaultCols);
  // const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', defaultTasks);
  // const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [completedOnly, setCompletedOnly] = useState<boolean>(false);
  const [todoOnly, setTodoOnly] = useState<boolean>(false);
  const filterOptions = useMemo(() => {
    return { completedOnly, todoOnly }
  }, [completedOnly, todoOnly])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // Columns:
  const createNewColumn = useCallback(() => {
    setColumns((prevColumns: Column[]) => {
      const columnToAdd: Column = {
        id: generateId(),
        title: `Column ${prevColumns.length + 1}`,
      };
      return [...prevColumns, columnToAdd]
    })
  }, [setColumns]);
  
  const updateColumn = useCallback((id: Id, title: string) => {
    setColumns((prevColumns: Column[]) => {
      const newColumns = prevColumns.map((col) => {
        if (col.id !== id) return col;
        return { ...col, title };
      });
      return newColumns;
    })
  }, [setColumns]);

  const deleteColumn = useCallback((id: Id) => {
    setColumns((prevColumns: Column[]) => {
      const filteredColumns = prevColumns.filter((col) => col.id !== id);
      return filteredColumns;
    });

    setTasks((prevTasks: Task[]) => {
      const newTasks = prevTasks.filter((t) => t.columnId !== id);
      return newTasks;
    });
  }, [setColumns, setTasks]);

  // Tasks:
  const createTask = useCallback((columnId: Id) => {
    setTasks((prevTasks: Task[]) => {
      const newTask: Task = {
        id: generateId(),
        columnId,
        content: `Task ${prevTasks.length + 1}`,
        completed: false
      };
      return [...prevTasks, newTask]
    });
  }, []);

  const deleteTask = useCallback((id: Id) => {
    setTasks((prevTasks: Task[]) => {
      const newTasks = prevTasks.filter((task) => task.id !== id);
      return [...newTasks]
    });
  }, []);

  const updateTask = useCallback((id: Id, content: string, completed: boolean) => {
    setTasks((prevTasks: Task[]) => {
      const newTasks = prevTasks.map((task) => {
        if (task.id !== id) return task;
        return { ...task, content, completed };
      });
  
      return [...newTasks]
    });
  }, []);

  const tasksByColumn = useMemo(() => {
    const tasksByCol: { [key: string]: Task[] } = {};

    columns.forEach((col) => {
      const colTasks = tasks.filter((task) => task.columnId === col.id) || []
      tasksByCol[col.id] = colTasks;
    })

    return tasksByCol;
  }, [columns, tasks])

  const toggleCompletedOnly = () => {
    setCompletedOnly((prev) => !prev);
    setTodoOnly(false);
  }
  const toggleTodoOnly = () => {
    setTodoOnly((prev) => !prev);
    setCompletedOnly(false);
  }

  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
      "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4 relative">
          
          <span className="absolute left-1 top-[-40px]">
            <Radio 
              label="Completed only"
              value={completedOnly} 
              onChange={toggleCompletedOnly}
             />
            <Radio 
              label="Todo only"
              value={todoOnly} 
              onChange={toggleTodoOnly}
             />
          </span>

          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <SortableColumn key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  columnTasks={tasksByColumn[col.id]}
                  filterOptions={filterOptions} 
                />
              ))}
            </SortableContext>
          </div>

          {/* Add Column Button */}
          <AddColumnButton createNewColumn={createNewColumn}/>
        </div>

        {createPortal(
          <DragOverlay>

            {activeColumn && (
              <SortableColumn
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                columnTasks={tasksByColumn[activeColumn.id]}
                filterOptions={filterOptions} 
              />
            )}

            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            
          </DragOverlay>,
          document.body
        )}

      </DndContext>
    </div>
  );

  // DND handlers
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column as Column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task as Task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns: Column[]) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks: Task[]) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks: Task[]) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}


const AddColumnButton = memo(({ createNewColumn }: { createNewColumn(): void }) => {
  return <button
    onClick={() => { createNewColumn() }}
    className="
      h-[60px] w-[350px] min-w-[350px]
      cursor-pointer rounded-lg
      bg-mainBackgroundColor border-2 border-columnBackgroundColor
      p-4
      ring-rose-500
      hover:ring-2
      flex
      gap-2
    "
  >
    <PlusIcon />
    Add Column
  </button>
})

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
