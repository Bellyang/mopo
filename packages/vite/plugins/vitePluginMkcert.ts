import mkcert from 'vite-plugin-mkcert'

export default (https: boolean) => https ? [mkcert()] : []
