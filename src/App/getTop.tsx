export const getTop = (container: HTMLElement | null): number => {
	if (container !== null) {
		const paddingTop = container.style.paddingTop
		const matches = paddingTop.match(/\d*/)
		if (matches) return Number(matches[0])
	}
	return 0
}
