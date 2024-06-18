import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
  directory: z.string().min(1, {
    message: "Cannot be empty",
  }),
  install: z.string().min(1, {
    message: "Cannot be empty",
  }),
  build: z.string().min(1, {
    message: "Cannot be empty",
  }),
  output: z.string().min(1, {
    message: "Cannot be empty",
  }),
});

export default function Configuration() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      directory: "./src",
      install: "npm install",
      build: "npm run build",
      output: "./dist"
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="directory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Root directory</FormLabel>
              <FormControl className="max-w-80">
                <Input placeholder="./src" {...field} className="bg-neutral-400"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="install"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Command to install dependencies</FormLabel>
              <FormControl className="max-w-80">
                <Input placeholder="npm install" {...field} className="bg-neutral-400"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="build"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Command to build the project</FormLabel>
              <FormControl className="max-w-80">
                <Input placeholder="npm run build" {...field} className="bg-neutral-400"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="output"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Directory for the output of the build</FormLabel>
              <FormControl className="max-w-80">
                <Input placeholder="./dist" {...field} className="bg-neutral-400"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
