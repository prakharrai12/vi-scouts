import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
  
  const variants = {
    default: "bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 text-slate-950 hover:from-cyan-400 hover:to-teal-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5",
    destructive: "bg-red-500/80 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    outline: "border border-cyan-500/30 bg-slate-900/60 hover:bg-cyan-500/15 text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/60",
    secondary: "bg-slate-800/80 text-slate-200 hover:bg-slate-700/90 hover:text-white border border-slate-700/60",
    ghost: "hover:bg-cyan-500/15 hover:text-cyan-300 text-slate-300",
    link: "text-cyan-400 underline-offset-4 hover:underline hover:text-cyan-300",
  }

  const sizes = {
    default: "h-11 px-5 py-2.5",
    sm: "h-9 rounded-lg px-3.5 text-xs",
    lg: "h-13 rounded-2xl px-8 text-base",
    icon: "h-11 w-11",
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
