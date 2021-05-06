import React from 'react'

export const Lines = (): JSX.Element => (
	<div
		id='container'
		style={{
			position: 'absolute',
			width: '100%',
			paddingTop: '10px',
			top: 0,
			bottom: 0,
			backgroundColor:
				process.env.NODE_ENV === 'production'
					? 'rgba(0,0,0,.03)'
					: 'rgba(0,0,0,.4)',
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
					height: '1px',
					marginBottom: key === 2 ? '0px' : 0,
					backgroundColor: 'rgba(255, 255, 255,1)',
					width: '100%',
					boxShadow: '0 1px 1px rgba(0, 0, 0,0.2)',
				}}
			/>
		))}
	</div>
)
