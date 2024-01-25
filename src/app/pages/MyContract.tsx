import { Button } from '@mui/material'
import { useClaimConditions, useContract, useContractRead, useNFTs, useSDK } from '@thirdweb-dev/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MintNftModal } from '../../components/Modal/MintNftModal'
import { ClaimConditionsModal } from '../../components/Modal/ClaimConditionsModal'
import { getFirestore, collection, addDoc, getDocs, query, doc, setDoc } from "firebase/firestore";
import appStore from '../../firebase'


export const MyContract = () => {

    const { contractId } = useParams()
    // const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    const { contract } = useContract(contractId);

    // const sdk = useSDK()
    // const [contract1, setcontract1] = useState<any>()
    // useEffect(() => {
    //     if (contract1) return
    //     (async () => {
    //         console?.log('TING')
    //         const contracttttt = await sdk?.getContract("0xa40Dd09849ce9368e38AeF0fB2650aD48Edb332A");
    //         console?.log('contracttttt', contracttttt)
    //         contracttttt && setcontract1(contracttttt)
    //     })()


    // }, [contract1, sleep(500)])

    const { data: nfts, isLoading } = useNFTs(contract);
    const { data: getName, error } = useContractRead(
        contract, 'name'
    );
    console?.log('nfts', nfts)
    console.log('contractRead', getName)

    const [open, setOpen] = React.useState(false);
    const [openClaimConditions, setOpenClaimConditions] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpenclaimConditions = () => {
        setOpenClaimConditions(true);
    };
    const handleCloseClaimConditions = () => {
        setOpenClaimConditions(false);
    };
    // const handlePublicNFTMarketplace = async () => {
    //     if (!nfts) return
    //     const nftMarketplaceList: string[] = await JSON.parse(localStorage.getItem('nftMarketplaceList')!) ? JSON.parse(localStorage.getItem('nftMarketplaceList')!) : []
    //     console.log('nftMarketplaceList', nftMarketplaceList)
    //     const updatedNFTs = nfts?.map(item => ({ ...item, contractAddress: contractId }));
    //     const newNftMarketplaceList = [...nftMarketplaceList, ...updatedNFTs]
    //     console.log('newNftMarketplaceList', newNftMarketplaceList)
    //     localStorage.setItem('nftMarketplaceList', JSON.stringify(newNftMarketplaceList))
    // }

    // const handlePublicNFTMarketplace = async () => {
    //     if (!nfts) return;

    //     const db = getFirestore(appStore);

    //     try {

    //         const nftMarketplaceListSnapshot = await getDocs(collection(db, "nftMarketplaceList"));

    //         const nftMarketplaceList = nftMarketplaceListSnapshot.docs.map(doc => doc.data());

    //         const arrayNftMarketplace = nftMarketplaceList?.[0]?.items ? nftMarketplaceList?.[0]?.items : []

    //         console.log('arrayNftMarketplace', arrayNftMarketplace);


    //         const updatedNFTs = nfts.map(item => ({ ...item, contractAddress: contractId }));
    //         const newNftMarketplaceList = [...arrayNftMarketplace, ...updatedNFTs];

    //         console.log('newNftMarketplaceList', newNftMarketplaceList);


    //         await addDoc(collection(db, "nftMarketplaceList"), { items: newNftMarketplaceList });

    //         console.log('Data has been saved to Firestore');
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    const handlePublicNFTMarketplace = async () => {
        if (!nfts) return;

        const db = getFirestore(appStore);

        try {
            // Thực hiện truy vấn để kiểm tra xem có tài liệu nào trong Firestore chưa
            const q = query(collection(db, 'nftMarketplaceList'));
            const querySnapshot = await getDocs(q);

            let docRef;

            if (querySnapshot.size === 0) {
                // Nếu không có tài liệu, tạo một tài liệu mới
                docRef = await addDoc(collection(db, 'nftMarketplaceList'), { items: [] });
            } else {
                // Nếu có tài liệu, sử dụng tài liệu đầu tiên (giả sử chỉ có một tài liệu)
                docRef = doc(db, 'nftMarketplaceList', querySnapshot.docs[0].id);
            }

            // Lấy dữ liệu từ Firestore
            const nftMarketplaceListSnapshot = await getDocs(q);

            const nftMarketplaceList = nftMarketplaceListSnapshot.docs.map((doc) => doc.data());
            const arrayNftMarketplace = nftMarketplaceList?.[0]?.items || [];

            console.log('arrayNftMarketplace', arrayNftMarketplace);

            // Cập nhật dữ liệu mới
            const updatedNFTs = nfts.map((item) => ({ ...item, contractAddress: contractId }));
            const newNftMarketplaceList = [...arrayNftMarketplace, ...updatedNFTs];

            console.log('newNftMarketplaceList', newNftMarketplaceList);

            // Thực hiện cập nhật tài liệu
            await setDoc(docRef, { items: newNftMarketplaceList });

            console.log('Data has been saved to Firestore');
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const { data: claimCondition } = useClaimConditions(contract);
    console?.log('claimCondition', claimCondition)
    return (
        <>
            {open && <MintNftModal open={open} handleClose={handleClose} contractAddress={contractId} />}
            {openClaimConditions && <ClaimConditionsModal open={openClaimConditions} handleClose={handleCloseClaimConditions} contractAddress={contractId} />}
            <div className='nfts-container'>

                <div className='contract-header'>
                    <div className='contract-header-name'>Contract Name: <span className='contract-header-sub'>{getName}</span></div>
                    <div className='contract-header-address'>Contract Address: <span className='contract-header-sub'>{contractId}</span></div>
                </div>
                <div className='nfts-header'>
                    <div className='nfts-title'>My Nfts</div>
                    <div className='nfts-header-button-wrap'>
                        <div className='nfts-header-button'>
                            <Button disabled={claimCondition?.length === 0 || claimCondition === undefined} variant="outlined" onClick={handlePublicNFTMarketplace}>
                                {claimCondition?.length === 0 || claimCondition === undefined ? 'not Public' : 'Public'}
                            </Button>
                        </div>
                        <div className='nfts-header-button'>

                            <Button variant="outlined" onClick={handleClickOpenclaimConditions}>
                                Claim Conditions Nft
                            </Button>
                        </div>
                        <div className='nfts-header-button'>
                            <Button variant="outlined" onClick={handleClickOpen}>
                                Mint Nft
                            </Button>
                        </div>
                    </div>
                </div>

                {nfts?.length !== 0 && <div className='nft-list'>
                    {nfts?.map((item, index) =>
                        <div key={index} className='nft-item-wrap'>
                            <div className='nft-item' >
                                <div>Owner: {item?.owner}</div>
                                <div>Supply: {item?.supply}</div>
                                <div>Type: {item?.type}</div>
                            </div>
                        </div>
                    )}
                </div>}
                {nfts?.length === 0 && <div>Empty</div>}
            </div >
        </>
    )
}
