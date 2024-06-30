import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Loader from './Loader';

export interface StatusProps {
    projectId: string;
}

export default function Status({ projectId }: StatusProps) {
    return (
        <div className="flex font-semibold border border-gray-700 h-10 w-40 justify-center items-center rounded-lg bg-white text-gray-500 pr-4 pl-4">
            <Dialog>
                <Loader />
                <DialogTrigger>{projectId}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Deployment is happening with project ID {projectId}</DialogTitle>
                        <DialogDescription>
                            Please wait for the deployment to finish.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}
