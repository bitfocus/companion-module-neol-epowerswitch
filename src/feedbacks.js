// feedbacks.js
export function initFeedbacks(self) {
	self.setFeedbackDefinitions({
		outletStateFromHidden: {
			type: 'boolean',
			name: 'ePowerSwitch: Outlet ON',
			description: 'Outlet is ON (state comes from shared polling of hidden.htm)',
			options: [
				{
					type: 'dropdown',
					id: 'outlet',
					label: 'Outlet',
					width: 6,
					default: 1,
					choices: [
						{ id: 1, label: 'Outlet 1' },
						{ id: 2, label: 'Outlet 2' },
						{ id: 3, label: 'Outlet 3' },
						{ id: 4, label: 'Outlet 4' },
					],
				},
			],
			defaultStyle: {
				bgcolor: 0x00ff00,
				color: 0x000000,
			},
			callback: (feedback) => {
				const outlet = Number(feedback.options.outlet ?? 1)
				return self.outletStates?.[outlet] === true
			},
		},
	})
}