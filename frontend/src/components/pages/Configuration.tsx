import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import Options from "../utils/Options";
import Console from "../utils/Console";

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
  const [configuration, setConfiguration] = useState<boolean>(false);
  const [uuid, setUUID] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      directory: "src",
      install: "npm install",
      build: "npm run build",
      output: "dist",
    },
  });

  const { toast } = useToast()
  const [submitted, setSubmitted] = useState<Boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitted(true);
    toast({
      title: "Please wait, we have will redirect you to the build logs after successfully obtaining the repository"
    })
    try {
      const response = await axios.post("http://localhost:3000/upload", {
        url: values.url,
        directory: values.directory,
        install: values.install,
        build: values.build,
        output: values.output,
      });
      if (response.status === 200) {
        setSubmitted(false);
        setConfiguration(true);
        setUUID(response.data.id);
        toast({
          title: "Configuration sent successfully, queued for deployment"
        })
      } else {
        setSubmitted(false);
        toast({
          title: "Enter valid configuration details",
          variant: "destructive"
        }
        );
      }
    } catch (err) {
      setSubmitted(false);
      toast({
        title: "Error sending configuration, please try again",
        variant: 'destructive',
      });
    }
  }
  return (
    <>
      {configuration ? (
        <>
          <Options projectId={uuid} />
          <Console projectId={uuid} />
        </>
      ) : (
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
                      placeholder="src"
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
                      placeholder="dist"
                      {...field}
                      className="bg-neutral-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={`${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submitted ? 'Submitted...' : 'Submit'}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
