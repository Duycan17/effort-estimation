import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { AlbrechtFormValues } from "@/types/prediction";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  Input: z.coerce.number().nonnegative("Input must be a positive number"),
  Output: z.coerce.number().nonnegative("Output must be a positive number"),
  Inquiry: z.coerce.number().nonnegative("Inquiry must be a positive number"),
  File: z.coerce.number().nonnegative("File must be a positive number"),
  AdjFP: z.coerce
    .number()
    .nonnegative("Adjusted Function Points must be a positive number"),
});

interface AlbrechtFormProps {
  onSubmit: (values: AlbrechtFormValues) => void;
}

export function AlbrechtForm({ onSubmit }: AlbrechtFormProps) {
  const form = useForm<AlbrechtFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Input: 0,
      Output: 0,
      Inquiry: 0,
      File: 0,
      AdjFP: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            name="Inquiry"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Inquiry</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Number of inquiry types)
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
                    (Number of files)
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
            name="AdjFP"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Adjusted Function Points</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Adjusted function points)
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
