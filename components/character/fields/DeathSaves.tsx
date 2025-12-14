"use client";

import { Heart } from "lucide-react";
import { ToggleCounter } from "./ToggleCounter";

type DeathSavesProps = {
  successes: number;
  failures: number;
  onChange: (type: "successes" | "failures", value: number) => void;
};

export function DeathSaves({ successes, failures, onChange }: DeathSavesProps) {
  return (
    <div className="space-y-1 flex flex-col">
      {/* Successes */}
      <div className="flex items-center">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Success
        </span>
        <ToggleCounter
          max={3}
          value={successes}
          onChange={(next) => onChange("successes", next)}
          icon={<Heart className="h-4 w-4" />}
          ariaLabel="Death save success"
          tooltip="Death save success"
          className="ml-1"
        />
      </div>

      {/* Failures */}
      <div className="flex items-center">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Failure
        </span>
        <ToggleCounter
          max={3}
          value={failures}
          onChange={(next) => onChange("failures", next)}
          icon={<Heart className="h-4 w-4 rotate-180 opacity-60" />}
          ariaLabel="Death save failure"
          tooltip="Death save failure"
          className="ml-1"
        />
      </div>
    </div>
  );
}
