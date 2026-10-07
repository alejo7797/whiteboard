/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { THEME } from '@nextcloud/excalidraw'
import { useEffect, useLayoutEffect, useState } from 'react'
import type { Theme } from '@excalidraw/excalidraw/types/types'

const STORAGE_KEY = 'whiteboard-theme'

function getDarkThemeMediaQuery(): MediaQueryList | undefined {
	return window.matchMedia?.('(prefers-color-scheme: dark)')
}

export function useThemeHandling() {
	const [appTheme, setAppTheme] = useState<Theme | 'system'>(() => {
		return (
			(localStorage.getItem(STORAGE_KEY) as Theme | 'system' | null) || THEME.LIGHT
		)
	})
	const [editorTheme, setEditorTheme] = useState<Theme>(THEME.LIGHT)

	useEffect(() => {
		const mediaQuery = getDarkThemeMediaQuery()

		const handleChange = (e: MediaQueryListEvent) => {
			setEditorTheme(e.matches ? THEME.DARK : THEME.LIGHT)
		}

		if (appTheme === 'system') {
			mediaQuery?.addEventListener('change', handleChange)
		}

		return () => {
			mediaQuery?.removeEventListener('change', handleChange)
		}
	}, [appTheme])

	useLayoutEffect(() => {
		localStorage.setItem(STORAGE_KEY, appTheme)

		if (appTheme === 'system') {
			setEditorTheme(getDarkThemeMediaQuery()?.matches ? THEME.DARK : THEME.LIGHT)
		} else {
			setEditorTheme(appTheme)
		}
	}, [appTheme])

	return { editorTheme, appTheme, setAppTheme }
}
