"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { Todo } from "@/types/todo";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import TodoForm from "@/components/Todos/TodoForm";
import TodoFilters from "@/components/Todos/TodoFilters";
import TodoList from "@/components/Todos/TodoList";
import UserMenu from "@/components/User/UserMenu";

export default function DashboardPage() {
  const router = useRouter();

  // ---------------- STATE ----------------
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<"all" | "completed" | "pending">("all");

  // ---------------- FETCH ----------------
  const fetchTodos = async () => {
    const data = await api("/todos");
    setTodos(data);
  };

  const fetchProfile = async () => {
    const data = await api("/user/profile");
    setUser(data);
  };

  useEffect(() => {
    fetchTodos();
    fetchProfile();
  }, []);

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    setLogoutLoading(true);
    try {
      await api("/auth/logout", { method: "POST" });
      router.replace("/");
    } finally {
      setLogoutLoading(false);
    }
  };

  // ---------------- CREATE ----------------
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

  // ---------------- UPDATE ----------------
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

  // ---------------- TOGGLE ----------------
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

  // ---------------- DELETE ----------------
  const deleteTodo = async (id: string) => {
    setActionLoadingId(id);
    await api(`/todos/${id}`, { method: "DELETE" });
    setActionLoadingId(null);
    fetchTodos();
  };

  // ---------------- FILTER ----------------
  const filteredTodos = todos
    .filter((todo) =>
      (todo.title + todo.description)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((todo) => {
      if (filter === "completed") return todo.completed;
      if (filter === "pending") return !todo.completed;
      return true;
    });

  // ---------------- UI ----------------
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Todos</CardTitle>

          <div className="flex items-center gap-2">
            <UserMenu user={user} />

            <Button
              variant="outline"
              onClick={logout}
              disabled={logoutLoading}
            >
              {logoutLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Logout
            </Button>
          </div>
        </CardHeader>

        {/* SEARCH + FILTER */}
        <div className="px-6 pb-2">
          <TodoFilters
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />
        </div>

        <CardContent className="space-y-6">
          {/* CREATE TODO */}
          <TodoForm
            title={title}
            description={description}
            loading={loading}
            setTitle={setTitle}
            setDescription={setDescription}
            onSubmit={addTodo}
          />

          {/* TODO LIST */}
          <TodoList
            todos={filteredTodos}
            editingId={editingId}
            setEditingId={setEditingId}
            actionLoadingId={actionLoadingId}
            updateTodo={updateTodo}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            setTodos={setTodos}
          />
        </CardContent>
      </Card>
    </div>
  );
}
