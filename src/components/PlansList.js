import React, { useState, useEffect } from 'react'
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import Modal from '@mui/material/Modal';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getAPICall, deleteAPICall } from "../utils/api";
import CreatePlan from './CreatePlan';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #FFF',
    borderRadius: '4px',
    boxShadow: 24,
    p: 4,
};

const PlansList = () => {
    // for add plan
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //for delete confirmation
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const handleDeleteOpen = (plan) => {
        setSelectedPlan(plan);
        setDeleteOpen(true);
    };
    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };

    //for update plan
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [updateOpen, setUpdateOpen] = React.useState(false)
    const handleUpdateOpen = async (plan) => {
        await setSelectedPlan(plan);
        setUpdateOpen(true);
    }
    const handleUpdateClose = () => setUpdateOpen(false);

    //for view plan details
    const [viewPlan, setViewPlan] = React.useState(false);
    const handleViewPlan = (plan) => {
        setSelectedPlan(plan);
        setViewPlan(true);

    };

    const handleViewClose = () => setViewPlan(false);

    const [plans, setPlans] = useState([]);

    const fetchAllPlans = async () => {
        try {
            const { data } = await getAPICall("/");
            setPlans(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAllPlans();
    }, []);

    const onAfterSave = () => {
        fetchAllPlans();
        handleClose();
        handleUpdateClose();
    };

    const handleDelete = async (c) => {
        await deleteAPICall(`/${selectedPlan.planId}`)
        fetchAllPlans();
        setDeleteOpen(false);
    }

    return (
        <Box sx={{ mt: 4, mr: 2, ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* <Button variant='contained' color='error' sx={{ mb: 2}}>
            Add Plan
        </Button> */}
            <div>
                <Button variant='contained' color='inherit' startIcon={<AddIcon />} onClick={handleOpen}>ADD PLAN</Button>
                <CreatePlan key={open} open={open} handleClose={handleClose} onSave={onAfterSave} />
            </div>
            <TableContainer component={Paper} sx={{ width: '100%', mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '5%' }}>
                                <Typography variant='h6' color='textPrimary'>
                                    Plan Id
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '15%' }}>
                                <Typography variant='h6' color='textPrimary'>
                                    Name
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '5%' }}>
                                <Typography variant='h6' color='textPrimary'>
                                    Category
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '5%' }}>
                                <Typography variant='h6' color='textPrimary'>
                                    Budget
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '5%' }}>
                                <Typography variant='h6' color='textPrimary'>
                                    Status
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '10%' }}>
                                <Typography variant='h6' color='textPrimary'>
                                    Action
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plans.map((plan) =>
                            <TableRow>
                                <TableCell>{plan.planId}</TableCell>
                                <TableCell sx={{ cursor: 'pointer', color: '#1B75BC', '&:hover': { color: '#155B8A', backgroundColor: 'rgba(27, 117, 188, 0.1)' }, '&:active': { color: '#0E4A6A', backgroundColor: 'rgba(27, 117, 188, 0.2)' } }} onClick={() => handleViewPlan(plan)} >{plan.planName}</TableCell>
                                <TableCell>{plan.planCategory.categoryName}</TableCell>
                                <TableCell>{plan.planBudget}</TableCell>
                                <TableCell>{plan.status ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color='success' startIcon={<CreateIcon />} sx={{ mr: 2 }} onClick={() => handleUpdateOpen(plan)} size='small'>Update</Button>

                                    <Button variant="outlined" color='error' startIcon={<DeleteIcon />} onClick={() => handleDeleteOpen(plan)} size='small'>
                                        Delete
                                    </Button>

                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <Modal
                open={updateOpen}
                onClose={handleUpdateClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ mb: 2, color: 'inherit', textAlign: 'center' }}>
                        Update Plan Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                label="Plan Name"
                                name="planName"

                                fullWidth
                                sx={{ mt: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                label="Plan Description"
                                name="planDescription"

                                fullWidth
                                multiline
                                rows={2}
                                sx={{ mt: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Plan Category</InputLabel>
                                <Select
                                    name="planCategory"
                                    label="Plan Category"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="Domestic">Domestic</MenuItem>
                                    <MenuItem value="Business">Business</MenuItem>

                                </Select>

                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Plan Budget"
                                name="planBudget"

                                fullWidth
                                sx={{ mt: 2 }}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="planStatus"
                                    label="Status"
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="outlined" color="error" size='small'>
                            Reset
                        </Button>
                        <Box>
                            <Button variant="contained" color="success" sx={{ mr: 1 }} size='small'>
                                Update
                            </Button>
                            <Button variant="outlined" onClick={handleUpdateClose} size='small'>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal> */}
            {selectedPlan && <CreatePlan key={selectedPlan.planName} action="edit" selectedPlan={selectedPlan} open={updateOpen} handleClose={handleUpdateClose} onSave={onAfterSave} />}
            <Dialog
                open={deleteOpen}
                onClose={handleDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Confirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this plan?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} size='small'>Cancel</Button>
                    <Button onClick={handleDelete} autoFocus color='error' size='small'>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {selectedPlan && <Modal
                open={viewPlan}
                onClose={handleViewClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ mb: 2, color: 'inherit', textAlign: 'center' }}
                    >
                        View Plan Details
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {/* Plan Name */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Name:
                            </Typography>
                            <Typography variant="body2">
                                {selectedPlan.planName}
                            </Typography>
                        </Grid>

                        {/* Plan Description */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Description:
                            </Typography>
                            <Typography variant="body2">
                                {selectedPlan.planDescription}
                            </Typography>
                        </Grid>

                        {/* Plan Budget */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Budget:
                            </Typography>
                            <Typography variant="body2">
                                ₹{selectedPlan.planBudget}
                            </Typography>
                        </Grid>

                        {/* Plan Category */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Category:
                            </Typography>
                            <Typography variant="body2">
                                {selectedPlan.planCategory.categoryName}
                            </Typography>
                        </Grid>

                        {/* Created On */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Created On:
                            </Typography>
                            <Typography variant="body2">
                                {new Date(selectedPlan.createdOn)?.toLocaleString()}
                            </Typography>
                        </Grid>

                        {/* Updated On */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Updated On:
                            </Typography>
                            <Typography variant="body2">
                                {new Date(selectedPlan.updatedOn)?.toLocaleString()}
                            </Typography>
                        </Grid>

                        {/* Plan Status */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Status:
                            </Typography>
                            <Typography variant="body2">
                                {selectedPlan.status ? 'Active' : 'Inactive'}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Close Button */}
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Button variant="outlined" color="inherit" size="small" onClick={handleViewClose}>
                            Close
                        </Button>
                    </Box>
                </Box>

            </Modal>}
        </Box>
    )
}

export default PlansList