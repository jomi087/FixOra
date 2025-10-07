
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageModalProps {
  src: string;
  alt?: string;
  trigger?: React.ReactNode; // Optional custom trigger button
  triggerImageStyle?: string
}

export function ImageModal({ src, alt = "Preview", trigger, triggerImageStyle  }: ImageModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <div className={`cursor-pointer overflow-hidden rounded-md border-2 ${ triggerImageStyle ? triggerImageStyle : "w-32 h-32" }`}>
            <img
              src={src}
              alt={alt}
              // width={18}
              // height={18}
              className="object-cover w-full h-full transition-transform hover:scale-98"
            />
          </div>
        )}
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[60vw] sm:max-h-[90vh] bg-transparent p-0 flex items-center justify-center  border-0 shadow-xl max-w-4xl"
      >
        {/* Accessibility hidden title/description */}
        <VisuallyHidden>
          <DialogTitle>{alt}</DialogTitle>
          <DialogDescription>{`Preview of uploaded ${alt}`}</DialogDescription>
        </VisuallyHidden>


        <div className="w-full flex justify-center">
          {/* Image */}
          <img
            src={src}
            alt={alt}
            className="max-h-[80vh] w-auto object-contain shadow-lg animate-in fade-in-50 zoom-in-95"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
