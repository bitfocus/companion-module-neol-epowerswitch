import { runEntrypoint } from '@companion-module/base'
import { upgradeScripts } from './upgrade.js'
import EPowerSwitchInstance from './src/index.js'

runEntrypoint(EPowerSwitchInstance, upgradeScripts)