import React, { useEffect, useState } from 'react'

import { Lines } from './Lines'
import { getCoordsFromKey } from './getCoordsFromKey'

const forBrandon = true
if (forBrandon) console.log('building for brandon')

const App = () => {
	const getTop = () =>
		document.querySelector('#container').style.paddingTop.match(/\d*/)

	function moveBy(xDelta, yDelta) {
		if (forBrandon) {
			window.resizeBy(-1, 0)
			if (xDelta) window.resizeBy(0, 2)
		}
		window.moveBy(xDelta, yDelta)
	}

	function setBottom(delta: number) {
		const container = document.querySelector('#container')
		const current = container.style.paddingTop.match(/\d*/)
		if (current - delta < 10) {
			moveBy(0, -delta)
			window.resizeBy(0, delta)
		} else if (current - delta < 100) {
			container.style.paddingTop = `${current - delta}px`
		}
	}
	function resizeWindow(x: number, y: number): void {
		console.log('resizing window', x, y)
		if (x) window.resizeBy(x, 0)
		else {
			if (window.outerHeight + y <= 100 || getTop() > 10) {
				setBottom(y)
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
		if (e.ctrlKey || e.shiftKey || e.altKey) resizeWindow(x, -y)
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
