import { ThemeProvider as NextThemesProvider } from "next-themes"
import type * as React from "react"

// https://tweakcn.com/community

export const themeConfig = [
	{
		value: "system",
		label: "System",
		colors: {
			bg: "bg-gradient-to-r from-white to-neutral-900",
			accent: "bg-gradient-to-r from-neutral-900 to-neutral-100",
		},
	},
	{
		value: "light",
		label: "Light",
		colors: {
			bg: "bg-white",
			accent: "bg-neutral-900",
		},
	},
	{
		value: "dark",
		label: "Dark",
		colors: {
			bg: "bg-neutral-900",
			accent: "bg-neutral-100",
		},
	},
	{
		value: "midnight",
		label: "Midnight",
		colors: {
			bg: "bg-[#1a1630]",
			accent: "bg-purple-400",
		},
	},
	{
		value: "forest",
		label: "Forest",
		colors: {
			bg: "bg-[#1a2e1f]",
			accent: "bg-emerald-400",
		},
	},
	{
		value: "coffee",
		label: "Coffee",
		colors: {
			bg: "bg-[#0c0908]",
			accent: "bg-[#c2956a]",
		},
	},
	{
		value: "terminal",
		label: "Terminale",
		colors: {
			bg: "bg-[#000000]",
			accent: "bg-[#00ff41]",
		},
	},
	{
		value: "astro-light",
		label: "Astro Light",
		colors: {
			bg: "bg-[#e8ebed]",
			accent: "bg-[#df6035]",
		},
	},
	{
		value: "astro-dark",
		label: "Astro Dark",
		colors: {
			bg: "bg-[#1a1a1a]",
			accent: "bg-[#df6035]",
		},
	},
	{
		value: "cyberdeck",
		label: "Cyberdeck ",
		colors: {
			bg: "bg-[#00DCFF]",
			accent: "bg-[#FF00FF]",
		},
	},
]

// ============================================
// DERIVED TYPES - Do not edit manually
// ============================================

// Derive Theme type from config (excludes "system" for actual themes)
export type Theme = (typeof themeConfig)[number]["value"]

// Derive theme values array for next-themes
export const themeValues = themeConfig.filter((t) => t.value !== "system").map((t) => t.value) as string[]

// Derive themes array (for backwards compatibility)
export const themes = themeConfig

// Derive theme colors map for ThemeSwitcher
export const themeColors = Object.fromEntries(themeConfig.map((t) => [t.value, t.colors])) as Record<
	Theme,
	{ bg: string; accent: string }
>

// ============================================
// THEME PROVIDER COMPONENT
// ============================================

interface ThemeProviderProps {
	children: React.ReactNode
	defaultTheme?: Theme
	storageKey?: string
}

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "theme" }: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme={defaultTheme}
			enableSystem={true}
			storageKey={storageKey}
			themes={themeValues}
		>
			{children}
		</NextThemesProvider>
	)
}
