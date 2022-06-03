import hashedResponseLog from './hashedResponseLog.json'
import unhashedResponseLog from './unhashedResponseLog.json'

let totalGas = 0
hashedResponseLog.map((log) => totalGas = totalGas + log.gasUsed)
unhashedResponseLog.map((log) => totalGas = totalGas + log.gasUsed)

console.log(totalGas)