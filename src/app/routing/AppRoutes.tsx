import React from 'react'
import { ConnectRoutes } from './ConnectRoutes'
import { ThirdwebProvider } from '@thirdweb-dev/react'

export const AppRoutes = () => {
    const activeChain = "mumbai";
    return (
        <>
            <ThirdwebProvider
                activeChain={activeChain}
                clientId={'452505a053210a1e5aab79b6a03ac164'}
            >
                <ConnectRoutes />
            </ThirdwebProvider>
        </>
    )
}
