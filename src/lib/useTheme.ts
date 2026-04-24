import { useEffect, useState } from "react"
import type { EditorTheme } from "./types"

const defaultTheme: EditorTheme = {
	fontFamily: "var(--app-font-serif)",
	fontSize: 16,
	colorPalette: "paper",
}

export function useTheme() {
	const [theme, setTheme] = useState<EditorTheme>(defaultTheme)

	useEffect(() => {
		const saved = localStorage.getItem("lumina-theme")
		if (saved) {
			try {
				setTheme(JSON.parse(saved))
			} catch (e) {
				// ignore
			}
		}
	}, [])

	const updateTheme = (newTheme: Partial<EditorTheme>) => {
		setTheme((prev) => {
			const updated = { ...prev, ...newTheme }
			localStorage.setItem("lumina-theme", JSON.stringify(updated))
			return updated
		})
	}

	return { theme, updateTheme }
}
