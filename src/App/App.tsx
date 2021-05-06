import React, { useEffect, useState } from 'react'

import { Lines } from './Lines'
import { getCoordsFromKey } from './getCoordsFromKey'

const forBrandon = true
if (forBrandon) console.log('building for brandon')

const App = () => {
	const container = ((): HTMLElement | null =>
		document.querySelector('#container'))()

	const getTop = (): number | undefined => {
		if (container) {
			const top = container.style.paddingTop.match(/\d*/)![0]
			return Number(top)
		}
		return undefined
	}

	function setLinesTop(delta: number) {
		const current = getTop()
		if (current! - delta < 10) {
			moveBy(0, -delta)
			window.resizeBy(0, delta)
		} else if (container && current! - delta < 100) {
			container.style.paddingTop = `${current! - delta}px`
		}
	}
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
			if (window.outerHeight + y <= 100 || getTop()! > 10) {
				setLinesTop(y)
			} else {
				moveBy(0, -y)
				window.resizeBy(0, y)
			}
		}
	}
	useEffect(() => window.resizeTo(400, 100), [])
	const [timesMoved, setTimesMoved] = useState(0)
	const [currentStep, setCurrentStep] = useState(1)
	useEffect(() => {
		if (timesMoved >= 30) {
			setCurrentStep(15)
		} else if (timesMoved >= 15) {
			setCurrentStep(10)
		} else if (timesMoved >= 5) {
			setCurrentStep(5)
		} else setCurrentStep(1)
	}, [timesMoved])
	const handleKeyDown = (e: KeyboardEvent) => {
		const [x, y] = getCoordsFromKey(e.key, currentStep)
		const controls = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
		if (!controls.includes(e.key)) return
		setTimesMoved(timesMoved + 1)
		if (e.ctrlKey || e.shiftKey || e.altKey) resizeBy(x, -y)
		else {
			moveBy(x, y)
			if (forBrandon) window.resizeBy(0, -2)
		}
	}
	const handleKeyUp = () => {
		setCurrentStep(1)
		setTimesMoved(0)
	}

	useEffect(() => {
		addEventListener('keydown', handleKeyDown)
		addEventListener('keyup', handleKeyUp)
		return () => {
			removeEventListener('keydown', handleKeyDown)
			removeEventListener('keyup', handleKeyUp)
		}
	}, [timesMoved])
	return <Lines />
}

export default App
