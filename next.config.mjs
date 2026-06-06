/** @type {import('next').NextConfig} */
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || ""
const isProjectPage = Boolean(process.env.GITHUB_ACTIONS) && !repositoryName.endsWith(".github.io")
const basePath = isProjectPage ? `/${repositoryName}` : ""

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
