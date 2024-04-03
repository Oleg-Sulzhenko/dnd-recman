export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
  completed: boolean;
};

export type TaskCardProps = { 
  task: Task;
  updateTask: (id: Id, content: string, completed: boolean) => void;
  deleteTask: (id: Id) => void;
}
