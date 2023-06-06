/** @type {import('next').NextConfig} */
module.exports = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://api.petfinder.com/v2/:path*'
            }
        ]
    }
}
