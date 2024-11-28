

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
import { getAPICall } from "../utils/api";
import { postAPICall } from "../utils/api";


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

const getDefaultValues = () => {
    return {
        "planName": "",
        "planDescription": "",
        "planBudget": 0,
        "planCategory": {
            "categoryId": 1,
        },
    }
};

const CreatePlan = ({ selectedPlan, handleClose, open, action, onSave }) => {
    // for add plan
    // const [open, setOpen] = React.useState(false);
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);
    //for update plan
    // const [selectedPlan, setSelectedPlan] = useState([]);

    const [formData, setFormData] = useState(action === "edit" ? selectedPlan : getDefaultValues());
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.planName.trim()) {
            newErrors.planName = "Plan name is required (2-100 characters)";
        } else if (formData.planName.length < 2 || formData.planName.length > 100) {
            newErrors.planName = "Plan name must be between 2 and 100 characters";
        }
        if (!formData.planDescription.trim()) {
            newErrors.planDescription = "Plan description is required (10-500 characters)";
        } else if (formData.planDescription.length < 10 || formData.planDescription.length > 500) {
            newErrors.planDescription = "Plan description must be between 10 and 500 characters";
        }
        if (formData.planBudget <= 0) {
            newErrors.planBudget = "Plan budget must be a positive number";
        }
        if (!formData.planCategory.categoryId) {
            newErrors.planCategory = "Please select a category";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (validateForm()) {
            try {
                const resp = await postAPICall("/save", formData);
                onSave(resp);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleCategoryChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            ["planCategory"]: { "categoryId": event.target.value },
        }));
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ mb: 2, color: 'inherit', textAlign: 'center' }}>
                    {/* Add New Plan */}
                    {action === "edit" ? "Update Plan" : "Add New Plan"}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="Plan Name"
                            name="planName"
                            value={formData.planName}
                            onChange={handleChange}
                            fullWidth
                            error={Boolean(errors.planName)}
                            helperText={errors.planName}
                            sx={{ mt: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="Plan Description"
                            name="planDescription"
                            value={formData.planDescription}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={2}
                            error={Boolean(errors.planDescription)}
                            helperText={errors.planDescription}
                            sx={{ mt: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Plan Category</InputLabel>
                            <Select
                                name="planCategory"
                                label="Plan Category"
                                value={formData.planCategory.categoryId}
                                onChange={handleCategoryChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="1">Domestic</MenuItem>
                                <MenuItem value="2">Business</MenuItem>
                            </Select>
                            {errors.planCategory && <Typography variant="body2" color="error">{errors.planCategory}</Typography>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Plan Budget"
                            name="planBudget"
                            // key={formData.planBudget}
                            value={formData.planBudget}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mt: 2 }}
                            type="number"
                            error={Boolean(errors.planBudget)}
                            helperText={errors.planBudget}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    {/* <Button variant="outlined" color="error" size='small'>
                        Reset
                    </Button> */}
                    {action !== "edit" && (
                        <Button variant="outlined" color="error" size="small" onClick={() => setFormData(getDefaultValues())}>
                            Reset
                        </Button>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        {/* Conditional button text and alignment */}
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mr: 1 }}
                            onClick={handleSave}
                            size="small"
                        >
                            {action === "edit" ? "Update" : "Add"}
                        </Button>
                        <Button variant="outlined" onClick={handleClose} size='small'>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>

    )
}

export default CreatePlan;