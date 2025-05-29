import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";

interface AlbrechtInputsProps {
  input_values: {
    AdjFP?: number;
    Input?: number;
    Output?: number;
    Inquiry?: number;
    File?: number;
  };
}

export function AlbrechtInputs({ input_values }: AlbrechtInputsProps) {
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
                <span className="text-gray-600">Adjusted Function Points</span>
                <span className="font-medium">
                  {input_values.AdjFP ?? "N/A"}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Input</span>
              <span className="font-medium">{input_values.Input ?? "N/A"}</span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Output</span>
              <span className="font-medium">
                {input_values.Output ?? "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Inquiry</span>
              <span className="font-medium">
                {input_values.Inquiry ?? "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">File</span>
              <span className="font-medium">{input_values.File ?? "N/A"}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
