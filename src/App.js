import AWS from "aws-sdk";
import { useState, useEffect } from "react";

function App() {
  const [licenseFile, setLicenseFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [s3, setS3] = useState(null);
  const [licenseFileName, setLicenseFileName] = useState("No file chosen");
  const [selfieFileName, setSelfieFileName] = useState("No file chosen");

  useEffect(() => {
    // Configure AWS SDK
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_REGION,
    });

    // Create S3 instance
    const s3Instance = new AWS.S3({
      params: { Bucket: process.env.REACT_APP_S3_BUCKET },
      region: process.env.REACT_APP_REGION,
    });

    setS3(s3Instance);
  }, []);

  const uploadFile = async (file, label) => {
    if (!s3 || !file) return;

    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET,
      Key: `${label}/${file.name}`,
      Body: file,
    };

    try {
      const upload = s3.putObject(params).on("httpUploadProgress", (evt) => {
        console.log(
          `Uploading ${label}: ` + parseInt((evt.loaded * 100) / evt.total) + "%"
        );
      }).promise();

      await upload;
      alert(`${label} uploaded successfully.`);
    } catch (err) {
      console.error(err);
      alert(`An error occurred while uploading the ${label}.`);
    }
  };

  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    setLicenseFile(file);
    setLicenseFileName(file ? file.name : "No file chosen");
  };

  const handleSelfieChange = (e) => {
    const file = e.target.files[0];
    setSelfieFile(file);
    setSelfieFileName(file ? file.name : "No file chosen");
  };

  return (
    <div className="App">
      <div className="upload-container">
        <div className="upload-box">
          <h3>Upload Driver's License</h3>
          <input
            type="file"
            id="license-file"
            className="file-input"
            onChange={handleLicenseChange}
            accept="image/*"
          />
          <label htmlFor="license-file" className="file-label">
            Choose File
          </label>
          <div className="file-name">{licenseFileName}</div>
          <button
            className="upload-button"
            onClick={() => uploadFile(licenseFile, "DriversLicense")}
          >
            Upload Driver's License
          </button>
        </div>

        <div className="upload-box">
          <h3>Upload Self-picture (Selfie)</h3>
          <input
            type="file"
            id="selfie-file"
            className="file-input"
            onChange={handleSelfieChange}
            accept="image/*"
          />
          <label htmlFor="selfie-file" className="file-label">
            Choose File
          </label>
          <div className="file-name">{selfieFileName}</div>
          <button
            className="upload-button"
            onClick={() => uploadFile(selfieFile, "Selfie")}
          >
            Upload Selfie
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;