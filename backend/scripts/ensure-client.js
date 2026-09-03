const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const backendDir = path.resolve(__dirname, '..')
const repoRoot = path.resolve(backendDir, '..')
const clientDir = path.join(backendDir, 'client')
const clientIndex = path.join(clientDir, 'index.html')
const distDir = path.join(repoRoot, 'dist')

try {
    execSync('npx vite build', { cwd: repoRoot, stdio: 'inherit' })
    if (!fs.existsSync(path.join(distDir, 'index.html'))) {
        throw new Error('vite build did not produce dist/index.html')
    }
    fs.rmSync(clientDir, { recursive: true, force: true })
    fs.cpSync(distDir, clientDir, { recursive: true })
    console.log('Frontend built into backend/client')
} catch (err) {
    if (fs.existsSync(clientIndex)) {
        console.warn('Frontend build skipped; using committed backend/client.')
        console.warn(String(err && err.message ? err.message : err))
        process.exit(0)
    }
    console.error('Frontend build failed and no backend/client/index.html was found.')
    process.exit(1)
}
