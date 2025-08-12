import type { BookingRequestPayload } from "@/shared/Types/booking";

import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogTitle,} from "@/components/ui/dialog";
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,} from "@/components/ui/alert-dialog";
import { useEffect, useRef, useState } from "react";
import { BellRing } from "lucide-react";
import notificationMp3 from '@/assets/bookingnotification.mp3'
import AuthService from "@/services/AuthService";
import { BookingStatus } from "@/shared/enums/BookingStatus";
import { toast } from "react-toastify";
import { Messages, validationMsg } from "@/utils/constant";
import { Input } from "../ui/input";


interface BookingApplicationDialogueProps {
  data: BookingRequestPayload;
  onClose: () => void;
}

const BookingApplicationDialouge: React.FC<BookingApplicationDialogueProps> = ({data,onClose,}) => {
    
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [actionType, setActionType] = useState<Exclude<BookingStatus, BookingStatus.PENDING> | null>(null);
    const [reason, setReason] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {

        const sound = new Audio(notificationMp3);
        sound.loop = true
        sound.play()
        audioRef.current = sound

        return () => {
            sound.pause()
        }

    }, []);

    const askConfirmation = (type: Exclude<BookingStatus, BookingStatus.PENDING>) => {
        setActionType(type);
        setConfirmOpen(true);
        audioRef.current?.pause();
        audioRef.current = null;
    };
    

    const handleConfirm =async () => {

        audioRef.current?.pause();
        audioRef.current = null;

        if (!actionType) return;
        if (actionType === BookingStatus.REJECTED && !reason.trim()) {
            return setErrorMsg(validationMsg.REASON_INVALID);
        }

        try {
            await AuthService.UpdateBookingStatusApi(data.bookingId, actionType,reason)
            toast.success(actionType.toLocaleUpperCase());
        } catch (error:any) {
            const errorMsg = error?.response?.data?.message || Messages.BOOKING_STATUS_FAILED;
            toast.error(errorMsg);
        }

        setConfirmOpen(false);
        onClose();
    };

    return (
        <>
            {/* Main Booking Request popup */}
            <Dialog open onOpenChange={onClose} >
                <DialogContent
                    className="pointer-events-none [&>button]:hidden"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <div className="pointer-events-auto rounded-lg border p-6 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <BellRing className="text-yellow-500" size={32} />
                            <div>
                                <DialogTitle className="text-lg font-semibold">
                                    New Booking Request
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground">
                                    Please accept to confirm this booking or reject to decline it.
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="space-y-1 mb-4">
                            <p>
                                <span className="font-medium">From:</span>{" "}
                                {data.userName.toLocaleUpperCase()}
                            </p>
                            <p>
                                <span className="font-medium">Issue Type:</span> {data.issueType}
                            </p>
                            <p>
                                <span className="font-medium">Date:</span> {data.fullDate}
                            </p>
                            <p>
                                <span className="font-medium">Time:</span> {data.time}
                            </p>
                            <p>
                                <span className="font-medium">Description:</span> {data.issue}
                            </p>
                        </div>

                        <DialogFooter className="flex justify-end gap-3">
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                                onClick={() => askConfirmation(BookingStatus.REJECTED)}
                            >
                                Reject
                            </button>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                                onClick={() => askConfirmation(BookingStatus.ACCEPTED)}
                            >
                                Accept
                            </button>
                        </DialogFooter>
                    </div>
                </DialogContent>

            </Dialog>
                
            {/*Confirmation popup */}
            {confirmOpen && (
                <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you really want to{" "}
                            {actionType === BookingStatus.ACCEPTED ? "accept" : "reject"}{" "}
                            this booking ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {actionType === BookingStatus.REJECTED &&
                        <>
                            <Input 
                                type="text"
                                placeholder="Enter a reason"
                                value={ reason }
                                onChange={(e : React.ChangeEvent<HTMLInputElement>) => {
                                    const val = e.target.value;
                                    setReason(val)
                                    if (val.trim().length > 0) {
                                        setErrorMsg("")
                                    }
                                }}
                            />
                            { errorMsg && <p className="text-sm">{ errorMsg }</p>  }      
                        </>
                    }
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setConfirmOpen(false)
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
};

export default BookingApplicationDialouge;
