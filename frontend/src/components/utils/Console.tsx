import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { StatusProps } from "./Status";
import { useEffect, useState } from "react";

export default function Console({ projectId }: StatusProps) {
    const { toast } = useToast();
    const [logs, setLogs] = useState<string>('');

    async function fetchLogs() {
        try {
            const response = await axios.get(`http://localhost:4000/${projectId}`);
            if (response.status === 200) {
                setLogs(prevLogs => prevLogs + response.data);
            }
        } catch (error) {
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
            <ScrollArea className="h-[400px] w-[600px] border p-4 m-8 text-white bg-black rounded-lg">
                <pre>{logs}</pre>
            </ScrollArea>
        </>
    );
}