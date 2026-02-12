"use client";

import { Todo } from "@/types/todo";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Loader2 } from "lucide-react";

interface Props {
  todo: Todo;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  actionLoadingId: string | null;
  updateTodo: (todo: Todo) => void;
  toggleComplete: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  setTodos: any;
}

export default function TodoItem(props: Props) {
  const {
    todo,
    editingId,
    setEditingId,
    actionLoadingId,
    updateTodo,
    toggleComplete,
    deleteTodo,
    setTodos,
  } = props;

  return (
    <li className="border rounded-md p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-4 flex-1">
          <Switch
            checked={todo.completed}
            onCheckedChange={() => toggleComplete(todo)}
            disabled={actionLoadingId === todo.id}
          />

          <div className="flex-1">
            {editingId === todo.id ? (
              <>
                <Input
                  value={todo.title}
                  onChange={(e) =>
                    setTodos((prev: Todo[]) =>
                      prev.map((t) =>
                        t.id === todo.id
                          ? { ...t, title: e.target.value }
                          : t
                      )
                    )
                  }
                />
                <Textarea
                  className="mt-2"
                  value={todo.description}
                  onChange={(e) =>
                    setTodos((prev: Todo[]) =>
                      prev.map((t) =>
                        t.id === todo.id
                          ? { ...t, description: e.target.value }
                          : t
                      )
                    )
                  }
                />
              </>
            ) : (
              <>
                <p className={`font-medium ${todo.completed && "line-through"}`}>
                  {todo.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {todo.description}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {editingId === todo.id ? (
            <Button
              size="sm"
              onClick={() => updateTodo(todo)}
              disabled={actionLoadingId === todo.id}
            >
              {actionLoadingId === todo.id && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditingId(todo.id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={() => deleteTodo(todo.id)}
            disabled={actionLoadingId === todo.id}
          >
            {actionLoadingId === todo.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-red-500" />
            )}
          </Button>
        </div>
      </div>
    </li>
  );
}
