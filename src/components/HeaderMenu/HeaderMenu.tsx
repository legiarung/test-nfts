import { ConnectWallet } from '@thirdweb-dev/react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export const HeaderMenu = () => {
    const location = useLocation()
    console.log('location', location)
    return (
        <header className='header-container'>
            <div className='header-logo'>
                <img src="https://freec.asia/_next/image?url=%2F_next%2Fstatic%2Fimage%2F_%2F_%2Fpackages%2Foptimal-page%2Fcomponents%2FHeader%2Fassets%2Ffreec-logo-blue.4e6e2815584a168db48f919b97f1008d.svg&w=128&q=75" />
            </div>
            <div className='header-menu'>
                <div className='header-menu-item'>
                    <Link
                        className={
                            `header-menu-item-a ` +
                            (location.pathname === '/' && 'active')
                        }
                        to='/'
                    >
                        NFTs Marketplace
                    </Link>
                </div>
                <div className='header-menu-item'>
                    <Link
                        className={
                            `header-menu-item-a ` +
                            (location.pathname ==='/my-account' && 'active')
                        }
                        to='/my-account'
                    >
                        My NFTs
                    </Link>

                </div>
            </div>
            <div className='header-account'>
                <ConnectWallet
                    theme={'light'}
                    modalSize={"wide"}
                />
            </div>
        </header>
    )
}
