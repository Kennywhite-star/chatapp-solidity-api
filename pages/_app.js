import '../styles/globals.css'
//internal import from context

import {ChatAppProvider} from "../Context/ChatAppContext"
import {NavBar } from "../Components/index"

//wrap yout app with the provider

const MyApp = ({ Component, pageProps }) => (
  <div>
    <ChatAppProvider>
         return <Component {...pageProps} />
    </ChatAppProvider>

  </div>
)

export default MyApp
