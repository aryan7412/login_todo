"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  title: string;
  description: string;
  loading: boolean;
  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  onSubmit: () => void;
}

export default function TodoForm({
  title,
  description,
  loading,
  setTitle,
  setDescription,
  onSubmit,
}: Props) {
  return (
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
      <Button onClick={onSubmit} disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add Todo
      </Button>
    </div>
  );
}
