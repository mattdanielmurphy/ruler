import React, { useEffect, useState } from 'react'

export default function ResizeArea({ shrinkLines }) {
	const [stopShrinking, setStopShrinking] = useState(false)
	function modifyScreenDimensions(width, height) {
		console.log(window)
		if (height < 0) {
			if (window.outerHeight < 400 && !stopShrinking) {
				console.log('shrink lines')
				shrinkLines(height, () => setStopShrinking(true))
			} else {
				setStopShrinking(false)
				window.resizeTo(window.outerWidth + width, window.outerHeight + height)
			}
		} else {
			window.resizeTo(window.outerWidth + width, window.outerHeight + height)
		}
	}
	function modifyScreenPosition(x, y) {
		if (window.outerHeight < 400) {
		} else {
			window.moveTo(window.screenX + x, window.screenY + y)
		}
	}
	useEffect(() => {
		window.addEventListener('keydown', (e) => {
			// keys resize window
			// ctrl makes translate
			// shift makes faster
			let x = 20
			if (e.shiftKey) {
				x = 2
			}
			if (e.ctrlKey) {
				switch (e.key) {
					case 'ArrowRight':
						modifyScreenPosition(x, 0)
						break
					case 'ArrowLeft':
						modifyScreenPosition(-x, 0)
						break
					case 'ArrowDown':
						modifyScreenPosition(0, x)
						break
					case 'ArrowUp':
						modifyScreenPosition(0, -x)
						break
					default:
						break
				}
			} else {
				switch (e.key) {
					case 'ArrowRight':
						modifyScreenDimensions(x, 0)
						break
					case 'ArrowLeft':
						modifyScreenDimensions(-x, 0)
						break
					case 'ArrowDown':
						modifyScreenPosition(0, x)
						modifyScreenDimensions(0, -x)
						break
					case 'ArrowUp':
						modifyScreenPosition(0, -x)
						modifyScreenDimensions(0, x)
						break
					default:
						break
				}
			}
		})

		// return () => {
		// 	window.removeEventListener('keydown')
		// }
	}, [])
	return (
		<>
			{/* <div
				onMouseDown={handleMouseDown}
				style={{
					position: 'absolute',
					bottom: 0,
					right: 0,
					background: 'grey',
					color: 'white',
					padding: '1em 2em',
				}}
			>
				resize area baby
			</div> */}
		</>
	)
}
