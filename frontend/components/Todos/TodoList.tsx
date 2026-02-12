"use client";

import { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

interface Props {
  todos: Todo[];

  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;

  actionLoadingId: string | null;

  updateTodo: (todo: Todo) => void | Promise<void>;
  toggleComplete: (todo: Todo) => void | Promise<void>;
  deleteTodo: (id: string) => void | Promise<void>;

  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export default function TodoList({
  todos,
  editingId,
  setEditingId,
  actionLoadingId,
  updateTodo,
  toggleComplete,
  deleteTodo,
  setTodos,
}: Props) {
  return (
    <ul className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editingId={editingId}
          setEditingId={setEditingId}
          actionLoadingId={actionLoadingId}
          updateTodo={updateTodo}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
          setTodos={setTodos}
        />
      ))}
    </ul>
  );
}
