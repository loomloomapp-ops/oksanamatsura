import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  poweredByHeader: false,
  turbopack: { root: path.resolve(dirname) },
}

export default nextConfig
