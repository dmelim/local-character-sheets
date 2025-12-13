"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RenameCharacterDialogProps = {
  id: string;
  name: string;
  version: number;
};

export function RenameCharacterDialog({ id, name, version }: RenameCharacterDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(name);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setValue(name);
  }, [name]);

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    if (!value.trim()) {
      setError("Please enter a name.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/characters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: value.trim(), expectedVersion: version }),
      });
      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("Character was updated elsewhere. Please refresh.");
        }
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to rename character");
      }
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to rename character");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
        >
          Rename
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Character</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={`rename-${id}`}>Name</Label>
            <Input
              id={`rename-${id}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

