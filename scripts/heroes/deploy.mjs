// render.js
import { spawn } from 'child_process'
import http from 'http'
import path from 'path'
import {fileURLToPath} from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist/')
const serverPort = 5175
const snapshotScript = path.resolve(__dirname, 'agent.js')

async function runCommand(cmd, args, opts = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts })
        child.on('exit', code => {
            code === 0 ? resolve() : reject(new Error(`Command failed: ${cmd} ${args.join(' ')}`))
        })
    })
}

async function waitForServer(url, timeout = 5000) {
    const start = Date.now()
    return new Promise((resolve, reject) => {
        function check() {
            http.get(url, () => resolve()).on('error', () => {
                if (Date.now() - start > timeout) return reject('Server timeout')
                setTimeout(check, 200)
            })
        }
        check()
    })
}

async function main() {
    console.log('🔧 Build Vite...')
    await runCommand('npx', ['vite', 'build'])

    console.log('🚀 Serve dist...')
    const serve = spawn('npx', ['serve', distDir, '-l', serverPort], { shell: true })
    serve.stdout.pipe(process.stdout)
    serve.stderr.pipe(process.stderr)

    await waitForServer(`http://localhost:${serverPort}`)

    console.log('📸 Snapshot...')
    await runCommand('node', [snapshotScript, `http://localhost:${serverPort}`])

    console.log('🛑 Arrêt du serveur...')
    serve.kill('SIGTERM')
}

main().catch(err => {
    console.error('❌ Erreur :', err)
    process.exit(1)
})