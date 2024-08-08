import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from '@material-tailwind/react';
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Pilih file terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:5000/api/upload`, formData);
      console.log('File uploaded successfully:', response.data);
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-slate-500">
      <Card className="w-full max-w-md p-6 mx-auto bg-white rounded-xl shadow-md space-y-4 mt-12 mb-12">
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            id="file-input"
          />
          {selectedFile && (
            <span className="text-md text-center font-sans text-green-600 bg-slate-200 p-2 mb-4">{selectedFile.name}</span>
          )}
          <label htmlFor="file-input">
            <Button
              label="Choose File"
              className="p-button-success mb-4 p-6 w-44 bg-cyan-500 shadow-lg shadow-cyan-500/50 rounded-md text-white"
              onClick={handleChooseFile}
            />
          </label>
          <Button
            label="Upload File"
            icon="pi pi-upload"
            className="p-button-info mb-4 p-4 w-64 bg-black rounded-md text-white"
            onClick={handleSubmit}
            disabled={isLoading}
          />
          <span className="text-sm font-sans text-gray-500 mb-2">File format: Excel/xlsx</span>
          {isLoading && (
            <div className="flex items-center justify-center mt-4">
              <ProgressSpinner />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default App;
