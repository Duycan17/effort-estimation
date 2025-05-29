import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";

interface DesharnaisInputsProps {
  input_values: {
    Length?: number;
    TeamExp?: number;
    Entities?: number;
    ManagerExp?: number;
    PointsAdjust?: number;
    Transactions?: number;
    PointsNonAjust?: number;
  };
}

export function DesharnaisInputs({ input_values }: DesharnaisInputsProps) {
  return (
    <Accordion type="single" collapsible className="w-full border rounded-lg">
      <AccordionItem value="inputs" className="border-none">
        <AccordionTrigger className="py-2 px-3 hover:no-underline hover:bg-gray-50 [&[data-state=open]>svg]:rotate-90">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
            <span className="text-sm font-medium">Input Parameters</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="col-span-2">
              <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                <span className="text-gray-600">Project Length</span>
                <span className="font-medium">{input_values.Length ?? 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Team Experience</span>
              <span className="font-medium">{input_values.TeamExp ?? 0}</span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Manager Experience</span>
              <span className="font-medium">
                {input_values.ManagerExp ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Entities</span>
              <span className="font-medium">{input_values.Entities ?? 0}</span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Transactions</span>
              <span className="font-medium">
                {input_values.Transactions ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Points (Adjusted)</span>
              <span className="font-medium">
                {input_values.PointsAdjust ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Points (Non-Adjusted)</span>
              <span className="font-medium">
                {input_values.PointsNonAjust ?? 0}
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
