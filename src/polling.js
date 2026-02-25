// polling.js
import { InstanceStatus } from '@companion-module/base'
import got from 'got'

export function stopPolling(self) {
	if (self.pollTimer) {
		clearInterval(self.pollTimer)
		self.pollTimer = null
	}
}

export function startPolling(self) {
	stopPolling(self)

	const interval = Number(self.config?.statusPollInterval ?? 1000)
	if (!interval || interval < 250) return

	// poll once immediately
	pollStatus(self).catch(() => {})

	self.pollTimer = setInterval(() => {
		pollStatus(self).catch(() => {})
	}, interval)
}

function buildHiddenBaseUrl(self) {
	let base = (self.config?.prefix || '').trim()
	const path = (self.config?.hiddenPath || '/hidden.htm').trim()

	if (!base) return null
	if (!/^https?:\/\//i.test(base)) base = `http://${base}`

	let url = base
	if (path) {
		if (url.endsWith('/') && path.startsWith('/')) url = url.slice(0, -1)
		url = `${url}${path}`
	}

	return url
}

export async function sendOutletCommand(self, outlet, mode) {
	try {
		const baseUrl = buildHiddenBaseUrl(self)
		if (!baseUrl) {
			self.updateStatus(InstanceStatus.BadConfig, 'Base URL (prefix) is empty')
			return
		}

		let cmd
		if (mode === 'on') cmd = 'ON'
		else if (mode === 'off') cmd = 'OFF'
		else cmd = self.outletStates?.[outlet] ? 'OFF' : 'ON'

		const url = `${baseUrl}?M0:O${outlet}=${cmd}`

		const res = await got.get(url, {
			throwHttpErrors: false,
			timeout: { request: 5000 },
		})

		if (res.statusCode < 200 || res.statusCode >= 300) {
			self.updateStatus(InstanceStatus.UnknownError, `HTTP ${res.statusCode}`)
			self.log('error', `Hidden command failed: HTTP ${res.statusCode}`)
			return
		}

		self.updateStatus(InstanceStatus.Ok)

		// early refresh
		pollStatus(self).catch(() => {})
	} catch (e) {
		self.updateStatus(InstanceStatus.UnknownError, e?.message ?? String(e))
		self.log('error', `Hidden command error: ${e?.message ?? e}`)
	}
}

export async function pollStatus(self) {
	try {
		const url = buildHiddenBaseUrl(self)
		if (!url) {
			self.updateStatus(InstanceStatus.BadConfig, 'Base URL (prefix) is empty')
			return
		}

		const res = await got.get(url, {
			throwHttpErrors: false,
			timeout: { request: 5000 },
		})

		if (res.statusCode < 200 || res.statusCode >= 300) {
			self.updateStatus(InstanceStatus.UnknownError, `HTTP ${res.statusCode}`)
			self.log('error', `Polling failed: HTTP ${res.statusCode}`)
			return
		}

		const body = res.body ?? ''

		const re = /M0:O([1-4])=(On|Off)/g
		let m
		const next = { 1: false, 2: false, 3: false, 4: false }
		let found = 0

		while ((m = re.exec(body)) !== null) {
			const o = Number(m[1])
			next[o] = m[2] === 'On'
			found++
		}

		if (found === 0) {
			self.updateStatus(InstanceStatus.UnknownError, 'No outlet states found in hidden.htm')
			self.log('error', 'Polling succeeded but no M0:O*=On/Off lines were found')
			return
		}

		self.outletStates = next

		self.setVariableValues({
			outlet_1: next[1] ? 'On' : 'Off',
			outlet_1_cmd: next[1] ? 'OFF' : 'ON',
			outlet_2: next[2] ? 'On' : 'Off',
			outlet_2_cmd: next[2] ? 'OFF' : 'ON',
			outlet_3: next[3] ? 'On' : 'Off',
			outlet_3_cmd: next[3] ? 'OFF' : 'ON',
			outlet_4: next[4] ? 'On' : 'Off',
			outlet_4_cmd: next[4] ? 'OFF' : 'ON',
		})

		self.updateStatus(InstanceStatus.Ok)
		self.checkFeedbacks()
	} catch (e) {
		self.updateStatus(InstanceStatus.UnknownError, e?.message ?? String(e))
		self.log('error', `Polling error: ${e?.message ?? e}`)
	}
}