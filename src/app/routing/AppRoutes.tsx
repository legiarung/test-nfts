import React from 'react'
import { ConnectRoutes } from './ConnectRoutes'
import { ThirdwebProvider } from '@thirdweb-dev/react'

export const AppRoutes = () => {
    const activeChain = "mumbai";
    return (
        <>
            <ThirdwebProvider
                activeChain={activeChain}
                clientId={process.env.REACT_APP_TEMPLATE_CLIENT_ID}
            >
                <ConnectRoutes />
            </ThirdwebProvider>
        </>
    )
}
