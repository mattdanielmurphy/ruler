import React, { useEffect, useRef, useState } from 'react'

import { getCoordsFromKey } from './getCoordsFromKey'

const Lines = () => (
	<div
		id='container'
		style={{
			position: 'absolute',
			width: '100%',
			paddingTop: '10px',
			top: 0,
			bottom: 0,
			backgroundColor: 'rgba(0,0,0,0.06)',
			paddingBottom: '4px',
			'-webkit-user-select': 'none',
			'-webkit-app-region': 'drag',
			cursor: 'pointer',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
		}}
	>
		{[1, 2, 3].map((key) => (
			<div
				key={key}
				style={{
					height: '2px',
					borderRadius: '2px',
					marginBottom: key === 2 ? '0px' : 0,
					backgroundColor: 'rgba(255, 255, 255,1)',
					width: '100%',
					boxShadow: '0 1px 1px rgba(0, 0, 0,0.2)',
				}}
			/>
		))}
	</div>
)

const App = () => {
	const getTop = () =>
		document.querySelector('#container').style.paddingTop.match(/\d*/)

	function setBottom(delta: number) {
		const container = document.querySelector('#container')
		const current = container.style.paddingTop.match(/\d*/)
		if (current - delta < 10) {
			window.moveBy(0, -delta)
			window.resizeBy(0, delta)
		} else if (current - delta < 100) {
			container.style.paddingTop = `${current - delta}px`
		}
	}
	function resizeWindow(x: number, y: number): void {
		if (x) window.resizeBy(x, 0)
		else {
			if (window.outerHeight + y <= 100 || getTop() > 10) {
				setBottom(y)
			} else {
				window.moveBy(0, -y)
				window.resizeBy(0, y)
			}
		}
	}
	function handleKeyDown(e) {
		const smallStep = 3
		const largeStep = smallStep * 3
		const speed = e.shiftKey ? smallStep : largeStep
		const [x, y] = getCoordsFromKey(e.key, speed)
		if (e.ctrlKey) window.moveBy(x, y)
		else resizeWindow(x, -y)
	}
	useEffect(() => {
		window.resizeTo(600, 100)
		addEventListener('keydown', handleKeyDown)
		return () => removeEventListener('keydown', handleKeyDown)
	}, [])
	return <Lines />
}

export default App
