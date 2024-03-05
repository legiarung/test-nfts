import React, { FC } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import * as Yup from 'yup'


import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { useAddress, useSDK } from '@thirdweb-dev/react';
import { useFormik } from 'formik';
import { CircularProgress } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

type Props = {
    open: boolean
    handleClose: () => void
}

export const DeployContractModal: FC<Props> = ({ open, handleClose }) => {
    const sdk = useSDK();
    const address = useAddress();

    const deployContract = async (type: string, name: string) => {
        console?.log('type', type)
        try {
            let contractId
            if (type === 'erc721') {
                console?.log('xxxx')
                contractId = await sdk?.deployer.deployNFTDrop({
                    name: name,
                    primary_sale_recipient: address || '',
                });

            } else if (type === 'erc1155') {
                console?.log('yyyyy')
                contractId = await sdk?.deployer.deployNFTCollection({
                    name: name,
                    primary_sale_recipient: address || '',
                });

            }

            console?.log('contractId', contractId)
            const contractList: string[] = await JSON.parse(localStorage.getItem('contractList')!) ? JSON.parse(localStorage.getItem('contractList')!) : []
            console.log('contractList', contractList)
            const newContractList = [...contractList, { name, contractId }]
            console.log('aaa', newContractList)
            localStorage.setItem('contractList', JSON.stringify(newContractList))
            handleClose()
        } catch (error) {
            console?.log('error', error)
        }

    }


    const initialValues = {
        name: '',
        type: 'erc1155'
    }
    const validationSchema = Yup.object().shape({
        name: Yup.string().required().label('contractName is required ')
    })

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true)
            try {
                console?.log('deployContract', values)
                await deployContract(values?.type, values?.name)

                setSubmitting(false)
            } catch (error) {

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
                        Deploy Contract
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
                                Contract Name
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
                            </div>
                            {formik.touched.name && formik.errors.name && (
                                <div className='fv-plugins-message-container text-danger'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.name}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='deploycontract_row'>
                            <label className={`deploycontract_left required fw-bold fs-6 mb-2`}>
                                Type
                            </label>
                            <div className='deploycontract_right'>
                                <span className="form-check form-check-custom form-check-solid">
                                    <input
                                        placeholder=''
                                        {...formik.getFieldProps('type')}
                                        type='radio'
                                        name='type'
                                        value='erc721'
                                        className='form-check-input'
                                        autoComplete='on'
                                        disabled={formik.isSubmitting}
                                    />
                                </span>
                                <span className='deploycontract_type'>ERC 721</span>
                            </div>
                            <div className='deploycontract_right'>
                                <span className="form-check form-check-custom form-check-solid">
                                    <input
                                        placeholder=''
                                        {...formik.getFieldProps('type')}
                                        type='radio'
                                        name='type'
                                        value='erc1155'
                                        className='form-check-input'
                                        autoComplete='on'
                                        disabled={formik.isSubmitting}
                                    />
                                </span>
                                <span className='deploycontract_type'>ERC 1155</span>
                            </div>
                            {formik.touched.type && formik.errors.type && (
                                <div className='fv-plugins-message-container text-danger'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.type}</span>
                                    </div>
                                </div>
                            )}
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
