"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  filter: "all" | "completed" | "pending";
  setFilter: (v: "all" | "completed" | "pending") => void;
}

export default function TodoFilters({
  search,
  setSearch,
  filter,
  setFilter,
}: Props) {
  return (
    <>
      <Input
        placeholder="Search todos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-2 mt-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>

        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>

        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
        >
          Pending
        </Button>
      </div>
    </>
  );
}
