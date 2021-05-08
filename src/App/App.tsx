import React, { useEffect, useState } from 'react'

import { Lines } from './Lines'
import { getCoordsFromKey } from './getCoordsFromKey'
import { getTop } from './getTop'

const forBrandon = false
if (forBrandon) console.log('building for brandon')

const App = (): JSX.Element => {
	const container = ((): HTMLElement | null =>
		document.querySelector('#container'))()

	const top = getTop(container)

	function moveBy(xDelta: number, yDelta: number) {
		if (forBrandon) {
			window.resizeBy(-1, 0)
			if (xDelta) window.resizeBy(0, 2)
		}
		window.moveBy(xDelta, yDelta)
	}
	function resizeBy(x: number, y: number): void {
		if (x) window.resizeBy(x, 0)
		else {
			if (window.outerHeight + y <= 100 || top > 10) {
				setLinesTop(y)
			} else {
				moveBy(0, -y)
				window.resizeBy(0, y)
			}
		}
	}
	function setLinesTop(delta: number) {
		if (top - delta < 10) {
			moveBy(0, -delta)
			window.resizeBy(0, delta)
		} else if (container && top - delta < 100) {
			container.style.paddingTop = `${top - delta}px`
		}
	}
	const [timesMoved, setTimesMoved] = useState(0)
	const [keysDown, setKeysDown] = useState({})
	const [modifierHeld, setModifierHeld] = useState(false)

	const handleKeyDown = (e: KeyboardEvent) => {
		setTimesMoved(timesMoved + 1)
		if (!keysDown[e.key]) {
			setKeysDown({ ...keysDown, [e.key]: e })
		}
	}
	const handleKeyUp = (e) => {
		const newKeysDown = keysDown
		delete newKeysDown[e.key]
		setKeysDown(newKeysDown)
		setTimesMoved(0)
	}
	function handleWheel(e: MouseEvent) {
		const { deltaY, deltaX } = e
		if (modifierHeld) window.moveBy(deltaX, deltaY)
		else window.resizeBy(deltaX, -deltaY)
	}

	useEffect(() => {
		const modifierHeld = Object.values(keysDown).some(
			(e) => e.ctrlKey || e.shiftKey || e.altKey,
		)
		if (modifierHeld) setModifierHeld(true)
		else setModifierHeld(false)

		Object.values(keysDown).forEach((e) => {
			const stepValue =
				timesMoved > 30
					? 60
					: timesMoved > 20
					? 40
					: timesMoved > 10
					? 20
					: timesMoved > 3
					? 10
					: 1
			const [x, y] = getCoordsFromKey(e.key, stepValue)
			const controls = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
			if (!controls.includes(e.key)) return
			if (e.ctrlKey || e.shiftKey || e.altKey) resizeBy(x, -y)
			else {
				moveBy(x, y)
				if (forBrandon) window.resizeBy(0, -2)
			}
		})
	}, [keysDown, timesMoved])

	useEffect(() => {
		addEventListener('keydown', handleKeyDown)
		addEventListener('keyup', handleKeyUp)
		addEventListener('wheel', handleWheel)
		return () => {
			removeEventListener('keydown', handleKeyDown)
			removeEventListener('keyup', handleKeyUp)
			removeEventListener('wheel', handleWheel)
		}
	}, [timesMoved, keysDown, modifierHeld])

	return <Lines />
}

export default App
