/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        NEXT_PUBLIC_QUESTION_SERVICE_URL: process.env.NEXT_PUBLIC_QUESTION_SERVICE_URL,
        NEXT_PUBLIC_IMAGE_UPLOAD_KEY: process.env.NEXT_PUBLIC_IMAGE_UPLOAD_KEY || undefined,
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
          // Prevent Monaco from being bundled on the server
          config.externals = config.externals || [];
          config.externals.push("@monaco-editor/react");
        }

        return config;
    },
}

module.exports = nextConfig
