import { Button, CircularProgress } from '@mui/material';
import { useActiveClaimCondition, useAddress, useClaimConditions, useClaimNFT, useClaimedNFTSupply, useContract, useNFT, useNFTs, useTotalCount } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import * as Yup from 'yup'

export const ClaimNfts = () => {

    const { contractId, tokenId } = useParams()
    console?.log('contractId', contractId)
    const { contract } = useContract(contractId);
    console?.log('contract', contract)
    const { data: claimCondition, isLoading } = useClaimConditions(contract);
    const { data: activeClaimCondition, error } = useActiveClaimCondition(contract);
    const { data: supply } = useClaimedNFTSupply(contract);
    console?.log('supply', supply)
    const { data: totalCount } = useTotalCount(contract);
    console?.log('claimCondition', claimCondition)
    console?.log('activeClaimCondition', activeClaimCondition)
    console?.log('totalCount', totalCount)
    const { data: nft, isLoading: loadingnft } = useNFT(contract, tokenId);
    console?.log('nft', nft)

    const { mutateAsync: claim } = useClaimNFT(contract);
    const address = useAddress();

    const claimNft = async () => {
        try {
            const result = await claim({
                to: address,
                quantity: 1,
            })
            console?.log('result', result)

        } catch (error) {
            console?.log('error', error)
        }


    }

    const validationSchema = Yup.object().shape({
    })

    const initialValues = {

    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true)
            console?.log('aaaaaa')
            try {
                console?.log('claimNft', values)
                await claimNft()

                setSubmitting(false)
            } catch (error) {

                setSubmitting(false)
            }
        },
    })


    return (
        <div className='claim_container'>
            <div className="claim_wrap">
                <div className="claim_content">
                    <form onSubmit={formik.handleSubmit} noValidate>
                        {
                            <div className='claim_info'>
                                <div className='claim_info_title'>{nft?.metadata?.name}</div>
                                <img src={nft?.metadata?.image!} alt="" />
                            </div>
                        }

                        <div className='claim_condition'>
                            Price: {activeClaimCondition?.currencyMetadata?.displayValue}  {activeClaimCondition?.currencyMetadata?.symbol}
                        </div>
                        <div className='claim_condition'>
                            <Button type='submit'>
                                <label >{(isLoading || loadingnft) ? 'Buying' : 'Buy'}</label>
                                {(isLoading || loadingnft) &&
                                    <CircularProgress
                                        color="secondary"
                                        size={18}
                                        variant="indeterminate"
                                        sx={{ marginLeft: '10px' }}
                                    />}
                            </Button>
                        </div>
                    </form>
                </div>


            </div>
        </div>
    )
}
