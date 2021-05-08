import React, { useEffect, useState } from 'react'

const styles = {
	position: 'absolute',
	width: '100%',
	top: 0,
	bottom: 0,
	paddingBottom: 75,
	backgroundColor:
		process.env.NODE_ENV === 'production'
			? 'rgba(0,0,0,.03)'
			: 'rgba(0,0,0,.03)',
	'-webkit-user-select': 'none',
	'-webkit-app-region': 'drag',
	cursor: 'pointer',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
}

export const Lines = (): JSX.Element => {
	const [draggingFrom, setDraggingFrom] = useState('')
	const [windowDimensions, setWindowDimensions] = useState([
		window.outerWidth,
		100,
	])
	const [origin, setOrigin] = useState([0, 0])
	const [windowPos, setWindowPos] = useState([window.screenX, window.screenY])

	const [paddingTop, setPaddingTop] = useState(10)

	function handleMouseDown(e: MouseEvent) {
		console.log(e)
		setOrigin([e.screenX, e.screenY])
		setWindowPos([window.screenX, window.screenY])
		setWindowDimensions([window.outerWidth, window.outerHeight])
		const { pageX, pageY } = e
		if (pageX < 20) setDraggingFrom('left')
		if (window.outerWidth - pageX < 20) setDraggingFrom('right')
		if (pageY < 20) setDraggingFrom('top')
		// if (window.outerHeight === 100 && pageY - paddingTop < 20) {
		// 	setDraggingFrom('top')
		// 	setOrigin([e.screenX, window.screenY])
		// }
		if (window.outerHeight - pageY < 20) setDraggingFrom('bottom')
	}
	function handleMouseMove(e: MouseEvent) {
		const [windowX, windowY] = windowPos
		const [windowWidth, windowHeight] = windowDimensions
		const [originX, originY] = origin
		if (draggingFrom) {
			console.log('dragging!', draggingFrom)
			if (draggingFrom === 'top') {
				const delta = originY - e.screenY
				if (delta < 0) {
					// shrinking window
					if (windowHeight + delta > 100) {
						window.resizeTo(window.outerWidth, windowHeight + delta)
						window.moveTo(windowX, windowY - delta)
					}
				} else {
					window.resizeTo(window.outerWidth, windowHeight + delta)
					window.moveTo(windowX, windowY - delta)
				}
			}
			if (draggingFrom === 'bottom') {
				// const delta = e.screenY - originY
				// window.resizeTo(window.outerWidth, windowHeight + e.pageY)
				// window.moveTo(windowX, windowY - delta)
			}
			if (draggingFrom === 'left') {
				const delta = e.screenX - originX
				window.moveTo(windowX + delta, windowY)
				window.resizeTo(windowWidth - delta, window.outerHeight)
			}
			if (draggingFrom === 'right') {
				const delta = e.screenX - originX
				window.resizeTo(windowWidth + delta, window.outerHeight)
			}
		}
	}
	function handleMouseUp(e: MouseEvent) {
		setDraggingFrom('')
	}

	useEffect(() => {
		const [windowWidth, windowHeight] = windowDimensions
		if (
			windowWidth !== window.outerWidth ||
			windowHeight !== window.outerHeight
		)
			setWindowDimensions([window.outerHeight, window.outerWidth])
	}, [window.outerHeight, window.outerWidth])

	useEffect(() => {
		addEventListener('mouseup', handleMouseUp)
		addEventListener('mousemove', handleMouseMove)
		return () => {
			removeEventListener('mouseup', handleMouseUp)
			removeEventListener('mousemove', handleMouseMove)
		}
	}, [draggingFrom])

	return (
		<>
			<div id='container' style={{ ...styles, paddingTop }}>
				{[1, 2, 3].map((key) => (
					<div
						key={key}
						style={{
							cursor: key === 1 ? 'ns-resize' : 'pointer',
							padding: '2px 0',
							width: '100%',
							'-webkit-app-region': key === 1 ? 'no-drag' : 'drag',
						}}
						onMouseDown={(e) => (key === 1 ? handleMouseDown(e) : () => {})}
					>
						<div
							style={{
								height: 1,
								backgroundColor: 'white',
								boxShadow: '0 1px 1px rgba(0, 0, 0,0.2)',
							}}
						></div>
					</div>
				))}
			</div>
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					height: 2,
					left: 0,
					right: 0,
					'-webkit-app-region': 'no-drag',
					cursor: 'ns-resize',
					backgroundColor: 'rgba(0,0,0,0.2)',
				}}
				onMouseDown={handleMouseDown}
			/>
			<div
				style={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					width: 5,
					left: 0,
					'-webkit-app-region': 'no-drag',
					cursor: 'ew-resize',
				}}
				// onMouseDown={handleMouseDown}
			/>
			<div
				style={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					width: 5,
					right: 0,
					'-webkit-app-region': 'no-drag',
					cursor: 'ew-resize',
				}}
				// onMouseDown={handleMouseDown}
			/>
		</>
	)
}
