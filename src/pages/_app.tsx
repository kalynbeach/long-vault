import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import DApp from "../components/DApp"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DApp>
      <Component {...pageProps} />
    </DApp>
  )
}

export default MyApp
