"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Todo } from "@/types/todo";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2, Pencil } from "lucide-react";

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchTodos = async () => {
    const data = await api("/todos");
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // -------- CREATE --------
  const addTodo = async () => {
    if (!title.trim()) return;

    setLoading(true);
    await api("/todos", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        completed: false,
      }),
    });

    setTitle("");
    setDescription("");
    setLoading(false);
    fetchTodos();
  };

  // -------- UPDATE --------
  const updateTodo = async (todo: Todo) => {
    setActionLoadingId(todo.id);

    await api(`/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      }),
    });

    setEditingId(null);
    setActionLoadingId(null);
    fetchTodos();
  };

  // -------- TOGGLE --------
  const toggleComplete = async (todo: Todo) => {
  setActionLoadingId(todo.id);
  try {
    await api(`/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify({
        completed: !todo.completed,
      }),
    });
    fetchTodos();
  } finally {
    setActionLoadingId(null);
  }
};

  // -------- DELETE --------
  const deleteTodo = async (id: string) => {
    setActionLoadingId(id);
    await api(`/todos/${id}`, { method: "DELETE" });
    setActionLoadingId(null);
    fetchTodos();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Todos</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* CREATE */}
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button onClick={addTodo} disabled={loading}>
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Todo
            </Button>
          </div>

          {/* LIST */}
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li key={todo.id} className="border rounded-md p-4">
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
                              setTodos((prev) =>
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
                              setTodos((prev) =>
                                prev.map((t) =>
                                  t.id === todo.id
                                    ? {
                                        ...t,
                                        description: e.target.value,
                                      }
                                    : t
                                )
                              )
                            }
                          />
                        </>
                      ) : (
                        <>
                          <p
                            className={`font-medium ${
                              todo.completed &&
                              "line-through text-muted-foreground"
                            }`}
                          >
                            {todo.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {todo.description}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
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
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
