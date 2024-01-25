import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { MyAccount } from '../pages/MyAccount'
import { NftMaketplace } from '../pages/NftMaketplace'
import { HeaderMenu } from '../../components/HeaderMenu/HeaderMenu'
import { MyContract } from '../pages/MyContract'
import { ClaimNfts } from '../pages/ClaimNfts'

export const ConnectRoutes = () => {
    return (
        <>
            <Routes>
                <Route
                    element={
                        <>
                            <HeaderMenu />
                            <Outlet />
                        </>
                    }
                >
                    <Route path='/' element={<NftMaketplace />} />
                    <Route path='/my-account' element={<MyAccount />} />
                    <Route path='/my-account/:contractId' element={<MyContract />} />
                    <Route path='/:contractId/:tokenId' element={<ClaimNfts />} />
                </Route>
            </Routes>

        </ >
    )
}
