import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { StatusProps } from "./Status";
import { useEffect, useState } from "react";

export default function Console({ projectId }: StatusProps) {
    const { toast } = useToast();
    const [logs, setLogs] = useState<string>('');

    async function fetchLogs() {
        try {
            const response = await axios.get(`http://localhost:4000/logs/${projectId}`);
            if (response.status === 200) {
                setLogs(response.data.logs);
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Cannot fetch your project's logs",
                variant: 'destructive',
            });
        }
    }

    useEffect(() => {
        fetchLogs();
        const intervalId = setInterval(fetchLogs, 5000);
        return () => clearInterval(intervalId);
    }, [projectId]);

    return (
        <>
            <ScrollArea className="h-[420px] w-[700px] border p-4 -ml-1 mt-8 text-white bg-black rounded-lg text-sm">
                <pre>{logs}</pre>
                <ScrollBar orientation='horizontal' />
            </ScrollArea>
        </>
    );
}