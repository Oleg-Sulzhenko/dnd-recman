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
import SortableColumn  from "../components/SortableColumn";
import ColumnContainer from "../components/ColumnContainer";
import TaskCard from "../components/TaskCard";
import useLocalStorage from "../hooks/useBoardData";

const defaultCols: Column[] = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "done",
    title: "NO RENDER PLEASE",
  },
];

const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "todo",
    // content: "List admin APIs for dashboard",
    content: "Todo 1",
  },
  {
    id: "2",
    columnId: "done",
    content:
      // "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
      "NO RENDER PLEASE",
  },
  // {
  //   id: "3",
  //   columnId: "doing",
  //   content: "Conduct security testing",
  // },
  // {
  //   id: "4",
  //   columnId: "doing",
  //   content: "Analyze competitors",
  // },
  // {
  //   id: "5",
  //   columnId: "done",
  //   content: "Create UI kit documentation",
  // },
  // {
  //   id: "6",
  //   columnId: "done",
  //   content: "Dev meeting",
  // },
  // {
  //   id: "7",
  //   columnId: "done",
  //   content: "Deliver dashboard prototype",
  // },
  // {
  //   id: "8",
  //   columnId: "todo",
  //   content: "Optimize application performance",
  // },
  // {
  //   id: "9",
  //   columnId: "todo",
  //   content: "Implement data validation",
  // },
  // {
  //   id: "10",
  //   columnId: "todo",
  //   content: "Design database schema",
  // },
  // {
  //   id: "11",
  //   columnId: "todo",
  //   content: "Integrate SSL web certificates into workflow",
  // },
  // {
  //   id: "12",
  //   columnId: "doing",
  //   content: "Implement error logging and monitoring",
  // },
  // {
  //   id: "13",
  //   columnId: "doing",
  //   content: "Design and implement responsive UI",
  // },
];

function KanbanBoard() {
  console.log('<<<KANBAN>>>')
  // const [columns, setColumns] = useLocalStorage('columns');
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // Columns:
  const createNewColumn = useCallback(() => {
    setColumns((prevColumns) => {
      const columnToAdd: Column = {
        id: generateId(),
        title: `Column ${prevColumns.length + 1}`,
      };
      return [...prevColumns, columnToAdd]
    })
  }, []);
  
  const updateColumn = useCallback((id: Id, title: string) => {
    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((col) => {
        if (col.id !== id) return col;
        return { ...col, title };
      });
      return newColumns;
    })
  }, []);
  // *
  const deleteColumn = useCallback((id: Id) => {
    setColumns((prevColumns) => {
      const filteredColumns = prevColumns.filter((col) => col.id !== id);
      return filteredColumns;
    });

    // !!!
    // const newTasks = tasks.filter((t) => t.columnId !== id);
    // setTasks(newTasks);
  }, []);

  // Tasks:
  const createTask = useCallback((columnId: Id) => {
    setTasks((prevTasks) => {
      const newTask: Task = {
        id: generateId(),
        columnId,
        content: `Task ${prevTasks.length + 1}`,
      };
      return [...prevTasks, newTask]
    });
  }, []);

  const deleteTask = useCallback((id: Id) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.filter((task) => task.id !== id);
      return [...newTasks]
    });
  }, []);

  const updateTask = useCallback((id: Id, content: string) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) => {
        if (task.id !== id) return task;
        return { ...task, content };
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
        <div className="m-auto flex gap-4">

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
                />
              ))}
            </SortableContext>
          </div>

          {/* Add Column Button */}
          <AddColumnButton createNewColumn={createNewColumn}/>
        </div>

        {/* {createPortal(
          <DragOverlay>

            {activeColumn && (
              <SortableColumn
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
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
        )} */}

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

    setColumns((columns) => {
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
      setTasks((tasks) => {
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
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}


const AddColumnButton = memo(({ createNewColumn }: { createNewColumn(): void }) => {
  console.log('AddColumnButton')

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
