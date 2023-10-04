import { RestartAlt } from "@mui/icons-material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DropzoneArea } from "mui-file-dropzone";
import React, { useState } from "react";

const EventDialog = ({ onClose, open, user_token }: any) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle
                sx={{ display: "flex", justifyContent: "space-evenly" }}
            >
                Add a New Event
            </DialogTitle>
            
        </Dialog>
    );
};

export default EventDialog;
