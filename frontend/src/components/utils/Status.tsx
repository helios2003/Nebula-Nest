import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Loader from './Loader';
import axios from "axios";
import { useState, useEffect } from "react";

export interface StatusProps {
    projectId: string;
}

export default function Status({ projectId }: StatusProps) {
    const [loading, setLoading] = useState<Boolean>(true);

    async function pollStatus() {
        try {
            const response = await axios.get(`http://localhost:4000/${projectId}`);
            console.log(response);
            if (response.status === 102) {
                setLoading(true);
            } else if (response.status === 200) {
                setLoading(false);
            }
        } catch(err) {
            console.error(err);
            //alert('Error occured, please deploy your application again');
        }
    }

    useEffect(() => {
        pollStatus();
        const intervalId = setInterval(pollStatus, 5000);
        return () => clearInterval(intervalId);
    }, [projectId]);
    
    return (
        <div className="flex font-semibold border border-gray-700 h-10 w-40 justify-center items-center rounded-lg bg-white text-gray-500 pr-4 pl-4">
            <Dialog>
                {loading ? <Loader /> : null}
                <DialogTrigger>{projectId}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Deployment is happening with project ID {projectId}</DialogTitle>
                        <DialogDescription>
                            {loading ? "Please wait for the deployment to finish" : "Project successfully deployed"}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}
