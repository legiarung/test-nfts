import Button from '@mui/material/Button';
import React from 'react'
import { DeployContractModal } from '../../components/Modal/DeployContractModal';
import { Link } from 'react-router-dom';

type contractType =  {
    name: string
    contractId: string
}

export const MyAccount = () => {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    
    const contractList: contractType[] = JSON.parse(localStorage.getItem('contractList')!) ? JSON.parse(localStorage.getItem('contractList')!) : []
    return (
        <div className='myaccount_container'>
            <div className='myaccount_button-deploy'>
                <div className='myaccount_contract_title'>My Contract</div>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Deploy Contract
                </Button>
                {open && <DeployContractModal open={open} handleClose={handleClose} />}
            </div>
            <div className="myaccount_contract-list">
                {contractList?.map((item, key) =>
                    <Link
                        key={key}
                        className={
                            `myaccount_contract-item `
                        }
                        to={`/my-account/${item.contractId}`}
                    >
                        <div className="myaccount_contract-item-container">
                            {item?.name}
                        </div>
                    </Link>
                )}
            </div>

        </div>
    )
}
