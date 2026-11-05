import { useTheme } from "next-themes"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { cn } from "@/lib/utils"

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

export function ThemeToggle({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme()
	const dark = resolvedTheme === "dark"

	return (
		<AnimatedThemeToggler
			theme={dark ? "dark" : "light"}
			onThemeChange={setTheme}
			duration={reduceMotion() ? 0 : 400}
			aria-label={dark ? "Use Light Appearance" : "Use Dark Appearance"}
			title={dark ? "Use Light Appearance" : "Use Dark Appearance"}
			className={cn(
				"size-8 flex items-center justify-center hover:bg-sidebar-accent rounded-md transition-colors [&_svg]:size-[18px]",
				className
			)}
		/>
	)
}
