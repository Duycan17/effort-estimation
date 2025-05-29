import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { DesharnaisFormValues } from "@/types/prediction";
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
  TeamExp: z.coerce
    .number()
    .nonnegative("Team Experience must be a positive number"),
  ManagerExp: z.coerce
    .number()
    .nonnegative("Manager Experience must be a positive number"),
  Length: z.coerce.number().nonnegative("Length must be a positive number"),
  Transactions: z.coerce
    .number()
    .nonnegative("Transactions must be a positive number"),
  Entities: z.coerce.number().nonnegative("Entities must be a positive number"),
  PointsNonAjust: z.coerce
    .number()
    .nonnegative("Points Non Adjust must be a positive number"),
  PointsAdjust: z.coerce
    .number()
    .nonnegative("Points Adjust must be a positive number"),
});

interface DesharnaisFormProps {
  onSubmit: (values: DesharnaisFormValues) => void;
}

export function DesharnaisForm({ onSubmit }: DesharnaisFormProps) {
  const form = useForm<DesharnaisFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      TeamExp: 0,
      ManagerExp: 0,
      Length: 0,
      Transactions: 0,
      Entities: 0,
      PointsNonAjust: 0,
      PointsAdjust: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="TeamExp"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Team Experience</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Years of experience)
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
            name="ManagerExp"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Manager Experience</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Years of experience)
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
            name="Length"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Length</FormLabel>
                  <div className="text-xs text-slate-500">(Project length)</div>
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
            name="Transactions"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Transactions</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Number of transactions)
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
            name="Entities"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Entities</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Number of entities)
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
            name="PointsNonAjust"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Points Non Adjust</FormLabel>
                  <div className="text-xs text-slate-500">
                    (Non-adjusted function points)
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
            name="PointsAdjust"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Points Adjust</FormLabel>
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
