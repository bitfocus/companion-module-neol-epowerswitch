// presets.js
export function initPresets(self) {
	const makeOutletPreset = (n) => ({
		type: 'button',
		category: 'Outlets',
		name: `OUT ${n} Toggle`,
		style: {
			text: `OUT ${n}`,
			size: '18',
			color: 0xffffff,
			bgcolor: 0x000000,
		},
		steps: [
			{
				down: [
					{
						actionId: 'toggle_outlet_hidden',
						options: { outlet: n, mode: 'toggle' },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'outletStateFromHidden',
				options: { outlet: n },
				style: { bgcolor: 0x00ff00, color: 0x000000 },
			},
		],
	})

	self.setPresetDefinitions({
		out1: makeOutletPreset(1),
		out2: makeOutletPreset(2),
		out3: makeOutletPreset(3),
		out4: makeOutletPreset(4),
	})
}