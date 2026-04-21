"use client";

import type { ModelFamily } from "@/lib/types";
import ModelCard from "./ModelCard";

export default function ModelFamilyCard({
  family,
  onRun,
}: {
  family: ModelFamily;
  onRun: (model: import("@/lib/types").Model) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="rounded-t-xl border-b [border-bottom-color:rgba(229,231,235,1)] bg-[#f9f9f9] px-5 py-4">
        <h3 className="font-semibold text-gray-900">{family.name}</h3>
        {family.groupName && family.groupName !== family.name && (
          <p className="mt-1 text-sm text-gray-500">{family.groupName}</p>
        )}
      </div>
      <ul className="divide-y divide-gray-100 px-5">
        {family.models.map((model) => (
          <li key={model.id} className="py-4 first:pt-5 last:pb-5">
            <ModelCard model={model} onRun={() => onRun(model)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
