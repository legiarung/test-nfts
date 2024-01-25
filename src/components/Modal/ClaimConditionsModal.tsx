import React, { FC, useEffect } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import * as Yup from 'yup'
import { constants, Contract, ethers, providers, utils } from 'ethers'


import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { useContract, useLazyMint, useSetClaimConditions } from '@thirdweb-dev/react';
import { useFormik } from 'formik';
import { Button, CircularProgress } from '@mui/material';

const MaxUint256 = ethers.constants.MaxUint256

type Props = {
    open: boolean
    handleClose: () => void
    contractAddress?: string
}

export type CURRENCY_METADATA = {
    name: string
    symbol: string
    address: string
}

export const ClaimConditionsModal: FC<Props> = ({ open, handleClose, contractAddress }) => {
    const { contract } = useContract(contractAddress);
    const {
        mutateAsync: setClaimConditions,
        isLoading,
        error,
    } = useSetClaimConditions(contract);

    const setClaimConditionsNfts = async ({ maxClaimablePerWallet, currencyAddress, price, maxClaimableSupply, startTime, waitInSeconds, snapshot }: any) => {
        try {



            const claimCondition = await setClaimConditions({
                phases: [
                    {
                        metadata: {
                            name: "Phase 1",
                        },
                        currencyAddress,
                        price,
                        maxClaimableSupply,
                        maxClaimablePerWallet,
                        startTime,
                        waitInSeconds,
                        snapshot
                    },
                ],
            })
            console?.log('claimCondition', claimCondition)
            claimCondition && handleClose()
        } catch (error) {
            console?.log('error', error)
        }

    }


    const initialValues = {
        price: 0,
        currencyAddress: '',
        maxClaimableSupply: 0,
        maxClaimablePerWallet: 0,
        startTime: '',
        snapshot: null
    }
    const validationSchema = Yup.object().shape({
        price: Yup.number().required().label('price is required '),
        currencyAddress: Yup.string().required().label('currencyAddress is required '),
        maxClaimableSupply: Yup.number().required().label('maxClaimableSupply is required '),
        startTime: Yup.date().required().label('startTime is required '),
        maxClaimablePerWallet: Yup.number().required().label('maxClaimablePerWallet is required '),
    })

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, setValues }) => {
            setSubmitting(true)
            try {
                console?.log('deployContract', values)
                await setClaimConditionsNfts({
                    currencyAddress: values?.currencyAddress,
                    price: values?.price,
                    maxClaimableSupply: values?.maxClaimableSupply,
                    maxClaimablePerWallet: values?.maxClaimablePerWallet,
                    startTime: values?.startTime ? new Date(values?.startTime) : new Date(),
                    waitInSeconds: MaxUint256,
                    snapshot: null
                })
                setValues(initialValues)

                setSubmitting(false)
            } catch (error) {
                handleClose()
                setSubmitting(false)
            }
        },
    })
    useEffect(() => {
        formik?.setFieldValue('currencyAddress', CURRENCIES[0]?.address)
    }, [open])

    console?.log('formik', formik?.values)

    const CURRENCIES = [
        {
            name: 'Wrapped Matic',
            symbol: 'WMATIC',
            address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        }
    ]
    return (
        <>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth={'lg'}
            >
                <form className='deploycontract_form' onSubmit={formik.handleSubmit} noValidate>
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Claim Conditions NFT
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        X
                    </IconButton>
                    <DialogContent dividers>
                        <div className='deploycontract_row'>
                            <label className={`deploycontract_left required fw-bold fs-6 mb-2`}>
                                Start Time
                            </label>
                            <div className='deploycontract_right'>
                                <input
                                    placeholder=''
                                    {...formik.getFieldProps('startTime')}
                                    type='datetime-local'
                                    name='startTime'
                                    className='form-control form-control-solid mb-3 mb-lg-0'
                                    autoComplete='on'
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.startTime && formik.errors.startTime && (
                                    <div className='fv-plugins-message-container text-danger'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.startTime}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='deploycontract_row'>
                            <label className={`deploycontract_left required fw-bold fs-6 mb-2`}>
                                maxClaimableSupply
                            </label>
                            <div className='deploycontract_right'>
                                <input
                                    placeholder=''
                                    {...formik.getFieldProps('maxClaimableSupply')}
                                    type='number'
                                    name='maxClaimableSupply'
                                    className='form-control form-control-solid mb-3 mb-lg-0'
                                    autoComplete='on'
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.maxClaimableSupply && formik.errors.maxClaimableSupply && (
                                    <div className='fv-plugins-message-container text-danger'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.maxClaimableSupply}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='deploycontract_row'>
                            <label className={`deploycontract_left required fw-bold fs-6 mb-2`}>
                                maxClaimablePerWallet
                            </label>
                            <div className='deploycontract_right'>
                                <input
                                    placeholder=''
                                    {...formik.getFieldProps('maxClaimablePerWallet')}
                                    type='number'
                                    name='maxClaimablePerWallet'
                                    className='form-control form-control-solid mb-3 mb-lg-0'
                                    autoComplete='on'
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.maxClaimablePerWallet && formik.errors.maxClaimablePerWallet && (
                                    <div className='fv-plugins-message-container text-danger'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.maxClaimablePerWallet}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='deploycontract_row'>
                            <label className={`deploycontract_left required fw-bold fs-6 mb-2`}>
                                Price
                            </label>
                            <div className='deploycontract_right'>
                                <input
                                    placeholder=''
                                    {...formik.getFieldProps('price')}
                                    type='number'
                                    name='price'
                                    className='form-control form-control-solid mb-3 mb-lg-0'
                                    autoComplete='on'
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.price && formik.errors.price && (
                                    <div className='fv-plugins-message-container text-danger'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.price}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='deploycontract_row'>
                            <label className={`deploycontract_left required fw-bold fs-6 mb-2`}>
                                Currency Address
                            </label>
                            <div className='deploycontract_right'>
                                <select
                                    {...formik.getFieldProps('currencyAddress')}
                                    name={'currencyAddress'}
                                    disabled={formik.isSubmitting || isLoading}
                                >
                                    {CURRENCIES?.map((cur: CURRENCY_METADATA, index) => (
                                        <option
                                            key={index}
                                            value={cur.address.toLowerCase()}
                                        >
                                            {cur.symbol} ({cur.name})
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.currencyAddress && formik.errors.currencyAddress && (
                                    <div className='fv-plugins-message-container text-danger'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.currencyAddress}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button type='submit' >
                            Submit
                            {formik?.isSubmitting && <CircularProgress
                                color="success"
                                size={18}
                                variant="indeterminate"
                                sx={{ marginLeft: '10px' }}
                            />}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

        </>
    )
}
