// actions.js
export function initActions(self) {
	self.setActionDefinitions({
		toggle_outlet_hidden: {
			name: 'ePowerSwitch: Control outlet (via hidden.htm)',
			description: 'Sends hidden.htm command M0:O{n}=ON/OFF. Toggle uses current polled state.',
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
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					width: 6,
					default: 'toggle',
					choices: [
						{ id: 'toggle', label: 'Toggle (auto)' },
						{ id: 'on', label: 'Force ON' },
						{ id: 'off', label: 'Force OFF' },
					],
				},
			],
			callback: async (action) => {
				const outlet = Number(action.options.outlet ?? 1)
				const mode = String(action.options.mode ?? 'toggle')
				await self.sendOutletCommand(outlet, mode)
			},
		},
	})
}