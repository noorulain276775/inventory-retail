import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';


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
    <div>
      <h2>Upload Jewelry Excel</h2>
      <input type="file" accept=".xlsx,.xls" onChange={handleUpload} />
    </div>
    );
}