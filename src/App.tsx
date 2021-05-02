import React, { useEffect, useRef, useState } from 'react'

const Canvas = (props) => {
	const canvasRef = useRef(null)

	const [y, setY] = useState(20)
	const [keyPressed, setKeyPressed] = useState()

	const [resizingWindow, setResizingWindow] = useState(false)

	// const [stopShrinking, setStopShrinking] = useState(false)
	function modifyScreenDimensions(width, height) {
		// if (height < 0) {
		// 	if (window.outerHeight < 400 && !stopShrinking) {
		// 		shrinkLines(height, () => setStopShrinking(true))
		// 	} else {
		// 		setStopShrinking(false)
		// 		window.resizeTo(window.outerWidth + width, window.outerHeight + height)
		// 	}
		// } else {
		window.resizeTo(window.outerWidth + width, window.outerHeight + height)
	}
	function modifyScreenPosition(x, y) {
		window.moveTo(window.screenX + x, window.screenY + y)
	}

	useEffect(() => {
		window.resizeTo(400, 100)
	}, [])

	useEffect(() => {
		document.addEventListener('keydown', setKeyPressed)
		document.addEventListener('keyup', () => setKeyPressed())
		return () => {
			document.removeEventListener('keydown', setKeyPressed)
			document.removeEventListener('keyup', () => setKeyPressed(undefined))
		}
	}, [setKeyPressed])

	useEffect(() => {
		const e = keyPressed

		function handleMoveWindow(x) {
			if (e.key === 'ArrowRight') modifyScreenPosition(x, 0)
			if (e.key === 'ArrowLeft') modifyScreenPosition(-x, 0)
			if (e.key === 'ArrowDown') modifyScreenPosition(0, x)
			if (e.key === 'ArrowUp') modifyScreenPosition(0, -x)
		}

		function handleResizeLines(x) {
			// x = x / 3
			if (e.key === 'ArrowDown' && y - x >= 0) setY(y - x)
			if (e.key === 'ArrowUp' && y + x <= screen.height) setY(y + x)
		}

		function handleResizeWindow(x) {
			x = x * 6
			if (e.key === 'ArrowRight') modifyScreenDimensions(x, 0)
			if (e.key === 'ArrowLeft') modifyScreenDimensions(-x, 0)
			if (e.key === 'ArrowDown') {
				modifyScreenPosition(0, x)
				modifyScreenDimensions(0, -x)
			}
			if (e.key === 'ArrowUp') {
				modifyScreenPosition(0, -x)
				modifyScreenDimensions(0, x)
			}
		}

		if (e) {
			const x = e.shiftKey ? 2 : 10
			// first, determine if moving or resizing
			if (!e) return
			if (e.ctrlKey) handleMoveWindow(x)
			else {
				// start with y = 0
				// when y > 100 and incrementing, change to resizing
				// when height < 100 and decrementing, change back to lines
				if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
					handleResizeWindow(x)
				if (y >= 100) {
					handleResizeWindow(x)
				}
				handleResizeLines(x)
			}
		}
		setKeyPressed()
	}, [keyPressed, y])

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		let requestId
		const draw = () => {
			const height = ctx.canvas.height
			const width = ctx.canvas.width
			const padding = 2
			const lineLength = 100
			ctx.clearRect(0, 0, width, height)
			ctx.fillStyle = 'rgba(120,50,140,1)'
			ctx.fillRect(0, 0, width, height)
			ctx.fillStyle = '#fff'
			ctx.beginPath()
			const bottom = height - padding
			ctx.moveTo(padding, height)
			ctx.lineTo(lineLength + padding, height)
			ctx.moveTo(padding, height - y)
			ctx.lineTo(lineLength + padding, height - y)
			ctx.stroke()
			ctx.moveTo(padding, height - y * 2)
			ctx.lineTo(lineLength + padding, height - y * 2)
			ctx.shadowOffsetX = 2
			ctx.shadowOffsetY = 2
			ctx.shadowBlur = 2
			ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
			ctx.stroke()
			requestId = requestAnimationFrame(draw)
		}

		draw(ctx)
		return () => {
			cancelAnimationFrame(requestId)
		}
	}, [y])

	return (
		<div
			style={{
				backgroundColor: 'rgba(255,255,255,0.5)',
				position: 'absolute',
				top: 0,
				bottom: 0,
			}}
		>
			<canvas
				ref={canvasRef}
				{...props}
				style={{ position: 'absolute', bottom: 0, height: window.innerHeight }}
			/>
		</div>
	)
}

export default Canvas
