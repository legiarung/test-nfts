import { collection, getDocs, getFirestore } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import appStore from '../../firebase'

export const NftMaketplace = () => {



    const [nftMarketplaceList, setNftMarketplaceList] = useState<any>()
    console?.log('nftMarketplaceList', nftMarketplaceList)

    useEffect(() => {
        const db = getFirestore(appStore);

        (async () => {
            const nftMarketplaceListSnapshot = await getDocs(collection(db, "nftMarketplaceList"));
            const nftMarketplaceList = nftMarketplaceListSnapshot?.docs.map(doc => doc.data());
            console?.log('xxxxx',nftMarketplaceList)
            setNftMarketplaceList(nftMarketplaceList)
        })()

    }, [])

    return (
        <div className='marketplace_container'>
            <h1 className='marketplace_title'>Browse Marketplace</h1>
            <div className="marketplace_list">
                {
                    nftMarketplaceList?.[0]?.items?.map((nft:any, index:number) =>
                        <div className="marketplace_item " key={index}>
                            <Link
                                className={
                                    `myaccount_contract-item `
                                }
                                to={`/${nft?.contractAddress}/${nft?.metadata?.id}`}
                            >
                                <div className="marketplace_item_container" >
                                    <div className="marketplace_item_img_wrap">
                                        <img className='marketplace_item_img' src={nft?.metadata?.image} alt="" />
                                    </div>
                                    <div className='marketplace_item_title'>{nft?.metadata?.name}</div>
                                    <div className='marketplace_item_info'>
                                        <div className="marketplace_item_info_left">
                                            <div className='marketplace_item_info_subtitle'>Mintting</div>
                                            <div className='marketplace_item_info_time'>Now</div>
                                        </div>
                                        <div className="marketplace_item_info_right">
                                            <div className='marketplace_item_info_subtitle'>Price</div>
                                            <div className='marketplace_item_info_price'>0.01 Matic</div>
                                        </div>
                                    </div>
                                </div>

                            </Link>
                        </div>
                    )
                }

            </div>
        </div>
    )
}
