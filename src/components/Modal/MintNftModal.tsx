import React, { FC } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import * as Yup from 'yup'


import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { useContract, useLazyMint } from '@thirdweb-dev/react';
import { useFormik } from 'formik';
import { CircularProgress } from '@mui/material';

type Props = {
    open: boolean
    handleClose: () => void
    contractAddress?: string
}

export const MintNftModal: FC<Props> = ({ open, handleClose, contractAddress }) => {
    const { contract } = useContract(contractAddress);
    const { mutateAsync: lazyMint, isLoading, error } = useLazyMint(contract);

    const mintNft = async ({ name, description, image }: any) => {
        try {

            console?.log('lazyMint', lazyMint)

            const newNft = await lazyMint({
                metadatas: [
                    {
                        name,
                        description,
                        image
                    },
                ],
            })
            console?.log('newNft', newNft)
            newNft && handleClose()
        } catch (error) {
            console?.log('error', error)
        }

    }

    const handleFile = (e: any, setFieldValue: any) => {
        const file = e.currentTarget.files[0]
        setFieldValue('image', file)
    }


    const initialValues = {
        name: '',
        description: '',
        image: ''
    }
    const validationSchema = Yup.object().shape({
        name: Yup.string().required().label('contractName is required '),
        description: Yup.string().required().label('description is required '),
        image: Yup.string().required().label('Image is required '),
    })

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true)
            try {
                console?.log('deployContract', values)
                await mintNft({
                    name: values?.name,
                    description: values?.description,
                    image: values?.image
                })

                setSubmitting(false)
            } catch (error) {
                handleClose()
                setSubmitting(false)
            }
        },
    })
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
                        Mint NFT
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
                                NFT Name
                            </label>
                            <div className='deploycontract_right'>
                                <input
                                    placeholder=''
                                    {...formik.getFieldProps('name')}
                                    type='text'
                                    name='name'
                                    className='form-control form-control-solid mb-3 mb-lg-0'
                                    autoComplete='on'
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className='fv-plugins-message-container text-danger'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='deploycontract_row'>
                            <label className={`deploycontract_left required fw-bold fs-6 mb-2`}>
                                NFT Description
                            </label>
                            <div className='deploycontract_right'>
                                <input
                                    placeholder=''
                                    {...formik.getFieldProps('description')}
                                    type='text'
                                    name='description'
                                    className='form-control form-control-solid mb-3 mb-lg-0'
                                    autoComplete='on'
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <div className='fv-plugins-message-container text-danger'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.description}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='deploycontract_row'>
                            <label className={`deploycontract_left required fw-bold fs-6 mb-2`}>
                                Nft Image
                            </label>
                            <div className='deploycontract_right'>
                                <input
                                    placeholder=''
                                    type='file'
                                    name='uploadfile'
                                    className='form-control form-control-solid mb-3 mb-lg-0'
                                    autoComplete='on'
                                    disabled={formik.isSubmitting}
                                    onChange={(e) => handleFile(e, formik?.setFieldValue)}
                                />
                                {formik.touched.image && formik.errors.image && (
                                    <div className='fv-plugins-message-container text-danger'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.image}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <button type='submit' >
                            Submit
                            {formik?.isSubmitting && <CircularProgress
                                color="success"
                                size={18}
                                variant="indeterminate"
                                sx={{ marginLeft: '10px' }}
                            />}
                        </button>
                    </DialogActions>
                </form>
            </Dialog>

        </>
    )
}
