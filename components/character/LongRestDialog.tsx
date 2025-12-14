"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Character } from "@/lib/character-types";
import type { OnFieldChange } from "./sections/types";
import { buildLongRestUpdates } from "@/lib/rest";
import { FlameKindling } from "lucide-react";

type LongRestDialogProps = {
  character: Character;
  onFieldChange: OnFieldChange;
};

export function LongRestDialog({
  character,
  onFieldChange,
}: LongRestDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleApply = () => {
    const updates = buildLongRestUpdates(character.data);
    for (const update of updates) {
      onFieldChange(update.path, update.value);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <FlameKindling />
          Long Rest
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Long Rest</DialogTitle>
          <DialogDescription>
            Restores HP (current to max, clears temp), clears death saves,
            resets expended spell slots, and recovers hit dice (spent reduced by
            half of max, minimum 1).
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleApply}>
            Apply Long Rest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
