import { Button } from "@/components/ui/button"
import {Dialog,DialogClose,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface ChangePasswordProps {
    changePassword: (password: string) => Promise<void>;
    errorMsg: string
    setErrorMsg: (errorMsg: string) => void;
    open: boolean;
    setOpen: (value: boolean) => void;
    loading : boolean
}


const ChangePassowrdDialog: React.FC<ChangePasswordProps> = ({ changePassword, errorMsg, setErrorMsg, open, setOpen, loading }) => {
    const [password, setPassword] = useState("")

    return (
        <Dialog open={open} onOpenChange={setOpen}>
          <form >
            <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">Change Password</Button>
            </DialogTrigger>
               <DialogDescription >
                    Click save when you&apos;re done.
                </DialogDescription>
            <DialogContent className="sm:max-w-[355px]">
                <DialogHeader>
                    <DialogTitle>Enter Current Password</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="Password">Password</Label>
                        <Input
                            id="Password"
                            name="Password"
                            value={password}
                            onChange = {(e)=>{setPassword(e.target.value)}}  
                        />
                        {errorMsg && (
                            <p className="text-sm text-red-500 mt-1">{errorMsg}</p>
                        )}
                    </div>
                </div> 
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            onClick={()=>{setErrorMsg("")}}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                        <Button
                            type="submit"
                            disabled={loading}
                            onClick={() => {
                                changePassword(password)
                            }}
                        >
                            { loading ? 'loading...' : 'done'}
                        </Button>
                </DialogFooter>
            </DialogContent>
        </form>
    </Dialog>
  )
}

export default ChangePassowrdDialog