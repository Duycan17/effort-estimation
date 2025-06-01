import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChinaFormValues } from "@/types/prediction";

const formSchema = z.object({
  AFP: z.coerce.number().nonnegative("AFP must be a positive number"),
  Input: z.coerce.number().nonnegative("Input must be a positive number"),
  Output: z.coerce.number().nonnegative("Output must be a positive number"),
  Enquiry: z.coerce.number().nonnegative("Enquiry must be a positive number"),
  File: z.coerce.number().nonnegative("File must be a positive number"),
  Interface: z.coerce
    .number()
    .nonnegative("Interface must be a positive number"),
  Resource: z.coerce.number().nonnegative("Resource must be a positive number"),
  Duration: z.coerce.number().nonnegative("Duration must be a positive number"),
});

interface ChinaFormProps {
  onSubmit: (values: ChinaFormValues) => void;
}

export function ChinaForm({ onSubmit }: ChinaFormProps) {
  const form = useForm<ChinaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      AFP: 0,
      Input: 0,
      Output: 0,
      Enquiry: 0,
      File: 0,
      Interface: 0,
      Resource: 0,
      Duration: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="AFP"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>AFP</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Adjusted Function Points)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Input"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Input</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Number of input types)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Output"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Output</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Number of output types)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Enquiry"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Enquiry</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Number of enquiry types - Search/lookup functions)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="File"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>File</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Number of logical files - Data groups)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Interface"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Interface</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Number of external interfaces - System integrations)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Resource"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Resource</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Number of resources allocated - Team size)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Duration"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Duration</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Expected duration in months - Project timeline)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
