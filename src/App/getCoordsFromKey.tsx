export function getCoordsFromKey(key: string, speed: number): number[] {
	return key === 'ArrowUp'
		? [0, -speed]
		: key === 'ArrowDown'
		? [0, speed]
		: key === 'ArrowLeft'
		? [-speed, 0]
		: key === 'ArrowRight'
		? [speed, 0]
		: [0, 0]
}
