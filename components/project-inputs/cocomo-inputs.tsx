import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";

interface CocomoInputsProps {
  input_values: {
    loc?: string;
    acap?: number;
    aexp?: number;
    lexp?: number;
    modp?: number;
    pcap?: number;
    sced?: number;
    tool?: number;
    vexp?: number;
  };
}

export function CocomoInputs({ input_values }: CocomoInputsProps) {
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
                <span className="text-gray-600">Lines of Code</span>
                <span className="font-medium">{input_values.loc ?? "N/A"}</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Analyst Cap.</span>
              <span className="font-medium">{input_values.acap ?? "N/A"}</span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">App. Exp.</span>
              <span className="font-medium">{input_values.aexp ?? "N/A"}</span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Lang. Exp.</span>
              <span className="font-medium">{input_values.lexp ?? "N/A"}</span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Prog. Cap.</span>
              <span className="font-medium">{input_values.pcap ?? "N/A"}</span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">VM Exp.</span>
              <span className="font-medium">{input_values.vexp ?? "N/A"}</span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Tools</span>
              <span className="font-medium">{input_values.tool ?? "N/A"}</span>
            </div>
            <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
              <span className="text-gray-600">Schedule</span>
              <span className="font-medium">{input_values.sced ?? "N/A"}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
