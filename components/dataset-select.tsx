import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Dataset } from "@/lib/prediction";

interface DatasetSelectProps {
  value: Dataset;
  onValueChange: (value: Dataset) => void;
}

export function DatasetSelect({ value, onValueChange }: DatasetSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select dataset" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="china">China Dataset</SelectItem>
        <SelectItem value="desharnais">Desharnais Dataset</SelectItem>
        <SelectItem value="albrecht">Albrecht Dataset</SelectItem>
        <SelectItem value="cocomo">COCOMO Dataset</SelectItem>
      </SelectContent>
    </Select>
  );
}
