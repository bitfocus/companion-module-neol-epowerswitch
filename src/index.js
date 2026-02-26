import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { configFields } from '../config.js'
import { upgradeScripts } from '../upgrade.js'

import { initActions } from './actions.js'
import { initFeedbacks } from './feedbacks.js'
import { initVariables } from './variables.js'
import { initPresets } from './presets.js'

import { startPolling, stopPolling, pollStatus, sendOutletCommand } from './polling.js'

class EPowerSwitchInstance extends InstanceBase {
	pollTimer = null
	outletStates = { 1: false, 2: false, 3: false, 4: false }

	configUpdated(config) {
		this.config = {
			prefix: '',
			hiddenPath: '/hidden.htm',
			statusPollInterval: 1000,
			...(config || {}),
		}

		this.updateStatus(InstanceStatus.Ok)

		// Restart polling with updated config
		startPolling(this)
	}

	init(config) {
		this.config = {
			prefix: '',
			hiddenPath: '/hidden.htm',
			statusPollInterval: 1000,
			...(config || {}),
		}

		this.updateStatus(InstanceStatus.Ok)

		initActions(this)
		initFeedbacks(this)
		initVariables(this)
		initPresets(this)

		startPolling(this)
	}

	// Return config fields for web config
	getConfigFields() {
		return configFields
	}

	// When module gets deleted
	async destroy() {
		stopPolling(this)
	}

	// Called by actions.js
	async sendOutletCommand(outlet, mode) {
		return sendOutletCommand(this, outlet, mode)
	}

	// Exposed for optional manual refresh
	async pollStatus() {
		return pollStatus(this)
	}
}

export default EPowerSwitchInstance
