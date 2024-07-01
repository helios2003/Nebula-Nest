import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function Delete() {
    const navigate = useNavigate();
    const { toast } = useToast();

    return (
        <div className="flex font-semibold border border-gray-700 h-10 w-40 justify-center items-center rounded-lg bg-white text-black">
            <Dialog>
                <DialogTrigger>Cancel Deployment</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will shut down and stop your deployment process.
                        </DialogDescription>
                        <Button onClick={() => {navigate('/')
                             toast({
                                title: "Deployment cancelled successfully"
                              })
                        }}>Cancel</Button>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}
