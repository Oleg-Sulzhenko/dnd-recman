import type { Column, Task } from "./types";

export const defaultCols: Column[] = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "done",
    title: "Completed",
  },
  {
    id: "isLocalstorage",
    title: "From Local Storage",
  },
];

export const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "todo",
    // content: "List admin APIs for dashboard",
    content: "Todo 1",
    completed: true
  },
  {
    id: "2",
    columnId: "done",
    content:
      "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
      // "NO RENDER PLEASE",
    completed: false
  },
  {
    id: "3",
    columnId: "done",
    content: "Conduct security testing",
    completed: false
  },
  {
    id: "4",
    columnId: "done",
    content: "Analyze competitors",
    completed: true
  },
  // {
  //   id: "5",
  //   columnId: "done",
  //   content: "Create UI kit documentation",
  //   completed: false
  // },
  // {
  //   id: "6",
  //   columnId: "done",
  //   content: "Dev meeting",
  //   completed: false
  // },
  // {
  //   id: "7",
  //   columnId: "done",
  //   content: "Deliver dashboard prototype",
  //   completed: false
  // },
  // {
  //   id: "8",
  //   columnId: "todo",
  //   content: "Optimize application performance",
  //   completed: false
  // },
  // {
  //   id: "9",
  //   columnId: "todo",
  //   content: "Implement data validation",
  //   completed: false
  // },
  // {
  //   id: "10",
  //   columnId: "todo",
  //   content: "Design database schema",
  //   completed: false
  // },
  // {
  //   id: "11",
  //   columnId: "todo",
  //   content: "Integrate SSL web certificates into workflow",
  //   completed: false
  // },
  // {
  //   id: "12",
  //   columnId: "doing",
  //   content: "Implement error logging and monitoring",
  //   completed: false
  // },
  // {
  //   id: "13",
  //   columnId: "doing",
  //   content: "Design and implement responsive UI",
  //   completed: false
  // },
];