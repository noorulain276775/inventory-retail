import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload'; // Optional: Add an icon
import Stack from '@mui/material/Stack';

export default function ExcelUploadButton() {
    const handleUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('excel_file', file);

        try {
            const res = await axios.post(`${BASE_URL}/product/upload-excel/`, formData);
            alert('Upload successful!');
            console.log(res.data);
        } catch (err) {
            alert('Upload failed');
        }
    };

    return (
        <Stack direction="row" spacing={2}>
            <input
                accept=".xlsx,.xls"
                id="upload-excel"
                type="file"
                style={{ display: 'none' }}
                onChange={handleUpload}
            />
            <label htmlFor="upload-excel">
                <Button
                    variant="contained"
                    component="span"
                    color="primary"
                    startIcon={<UploadIcon />}
                >
                    Upload Excel
                </Button>
            </label>
        </Stack>
    );
}
