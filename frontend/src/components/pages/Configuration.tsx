import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  url: z.string().min(1, {
    message: "Cannot be empty",
  }),
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
  // const [URL, setURL] = useState<string>("");
  // const [directory, setDirectory] = useState<string>("");
  // const [install, setInstall] = useState<string>("");
  // const [build, setBuild] = useState<string>("");
  // const [output, setOutput] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      directory: "./src",
      install: "npm install",
      build: "npm run build",
      output: "./dist",
    },
  });

  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const response = await axios.post("http://localhost:3000/upload", {
          url: values.url,
          directory: values.directory,
          install: values.install,
          build: values.build,
          output: values.output,
        });
        console.log(response.status);
        if (response.status === 200) {
          toast({
            title: "Configuration sent successfully, queued for deployment"
          })
        } {
          toast({
              title: "Enter valid configuration details"
            }
          )
        }
      } catch(err) {
        toast({
          title: "Error sending configuration",
        });
      }
    }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">GitHub/GitlLab URL</FormLabel>
              <FormControl className="max-w-80">
                <Input
                  placeholder="https://github.com/username/repo.git"
                  {...field}
                  className="bg-neutral-400 h-8"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="directory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                Root directory
              </FormLabel>
              <FormControl className="max-w-80">
                <Input
                  placeholder="./src"
                  {...field}
                  className="bg-neutral-400 h-8"
                  // onChange={(e) => {
                  //   setDirectory(e.target.value);
                  // }}
                />
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
              <FormLabel className="text-white">
                Command to install dependencies
              </FormLabel>
              <FormControl className="max-w-80 h-8">
                <Input
                  placeholder="npm install"
                  {...field}
                  className="bg-neutral-400"
                  // onChange={(e) => {
                  //   setInstall(e.target.value);
                  // }}
                />
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
              <FormLabel className="text-white">
                Command to build the project
              </FormLabel>
              <FormControl className="max-w-80 h-8">
                <Input
                  placeholder="npm run build"
                  {...field}
                  className="bg-neutral-400"
                  // onChange={(e) => {
                  //   setBuild(e.target.value);
                  // }}
                />
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
              <FormLabel className="text-white">
                Directory for the output of the build
              </FormLabel>
              <FormControl className="max-w-80 h-8">
                <Input
                  placeholder="./dist"
                  {...field}
                  className="bg-neutral-400"
                  // onChange={(e) => {
                  //   setOutput(e.target.value);
                  // }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" onSubmit={onSubmit()}>Submit</Button>
      </form>
    </Form>
  );
}
