import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading your data.", 
  onRetry,
  className 
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-4 text-center", className)}>
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try again</span>
        </Button>
      )}
    </div>
  )
}