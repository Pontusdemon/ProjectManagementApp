import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"

interface ConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void 
    title: string 
    description: string
    confirmLabel: string
    onConfirm: () => void
}

const ConfirmDialog = ({open, onOpenChange, title, description, confirmLabel, onConfirm}:ConfirmDialogProps) => {
    const handleConfirm = () => {
        onConfirm()
        onOpenChange(false)
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleConfirm}>
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmDialog