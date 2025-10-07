import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";

export interface CancelDialogeProps {
	setConfirmOpen : (value:boolean) => void
	handleConfirmation : () => void
}
const CancelDialoge: React.FC<CancelDialogeProps> = ({ setConfirmOpen, handleConfirmation }) => {
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger
                  className="font-semibold pb-2 flex-none gap-1 hover:no-underline" >
									Please review our<span className="font-bold hover:underline">Refund Policy</span>before proceeding.
                </AccordionTrigger>
                <AccordionContent>
                  <p>
										* You are eligible for a <span className="font-medium">full refund</span> if
										you cancel within <span className="font-medium">15 minutes</span> of
										booking, provided at least that much time remains before the scheduled slot.
                  </p>
                  <p className="mt-2">
										* If less than 15 minutes remain before your slot, the full refund window is
										limited to the actual time left. For example, booking at 7:55 AM for an
										8:00 AM slot allows cancellation by 7:57 AM for a full refund.
                  </p>
                  <p className="mt-2">
										* Cancellations made after this window are eligible for a{" "}
                    <span className="font-medium">50% refund</span>.
                  </p>
                  <p className="mt-2 italic text-gray-600">
										This policy helps ensure fairness by offsetting the provider’s time and
										commitment to your booking.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AlertDialogDescription>

        </AlertDialogHeader>
        {/* Refund Policy Section */}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmOpen(false)}>
						Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmation}>Yes</AlertDialogAction>
        </AlertDialogFooter>

        <div className="text-xs text-gray-500 text-center">
					By clicking <span className="font-medium text-cyan-400">Yes</span>, you confirm that you have
					read and understood the Refund Policy.
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelDialoge;