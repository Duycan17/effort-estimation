import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { CocomoFormValues } from "@/types/prediction";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// const formSchema = z.object({
//   acap: z.coerce.number().min(0.1).max(1.5, "ACAP must be between 0.1 and 1.5"),
//   aexp: z.coerce.number().min(0.1).max(1.5, "AEXP must be between 0.1 and 1.5"),
//   pcap: z.coerce.number().min(0.1).max(1.5, "PCAP must be between 0.1 and 1.5"),
//   vexp: z.coerce.number().min(0.1).max(1.5, "VEXP must be between 0.1 and 1.5"),
//   lexp: z.coerce.number().min(0.1).max(1.5, "LEXP must be between 0.1 and 1.5"),
//   modp: z.coerce.number().min(0.1).max(1.5, "MODP must be between 0.1 and 1.5"),
//   tool: z.coerce.number().min(0.1).max(1.5, "TOOL must be between 0.1 and 1.5"),
//   sced: z.coerce.number().min(0.1).max(1.5, "SCED must be between 0.1 and 1.5"),
//   loc: z.coerce.number().nonnegative("LOC must be a positive number"),
// });

interface CocomoFormProps {
  onSubmit: (values: CocomoFormValues) => void;
}

export function CocomoForm({ onSubmit }: CocomoFormProps) {
  const form = useForm<CocomoFormValues>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      acap: 1,
      aexp: 1,
      pcap: 1,
      vexp: 1,
      lexp: 1,
      modp: 1,
      tool: 1,
      sced: 1,
      loc: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="acap"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>ACAP</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Analyst Capability- Analysis skills)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" step="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aexp"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>AEXP</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Relevant Applications Experience)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" step="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pcap"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>PCAP</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Programmer Capability - Development skills)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" step="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vexp"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>VEXP</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Virtual Machine Experience - Platform knowledge)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" step="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lexp"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>LEXP</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Language Experience - Tech stack proficiency)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" step="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="modp"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>MODP</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Modern Programming Practices - Development methodology)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" step="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tool"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>TOOL</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Use of Software Tools - Development tools)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" step="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sced"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>SCED</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Required Development Schedule - Timeline constraints)
                  </div>
                </div>
                <FormControl>
                  <Input type="number" step="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loc"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>LOC</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Lines of Code - Project size metric)
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
