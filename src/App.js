import AWS from "aws-sdk";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [licenseFile, setLicenseFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [s3, setS3] = useState(null);
  const [licenseFileName, setLicenseFileName] = useState("No file chosen");
  const [selfieFileName, setSelfieFileName] = useState("No file chosen");
  const [sessionId, setSessionId] = useState(null);

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

    // Generate a unique session ID
    const uuid = uuidv4();
    setSessionId(uuid);
  }, []);

  const uploadFile = async (file, label) => {
    if (!s3 || !file || !sessionId) return;

    // Use consistent naming for the Lambda function to process files
    const fileName = label === "DriversLicense" ? `${sessionId}_dl.jpg` : `${sessionId}_selfie.jpg`;
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET,
      Key: fileName,
      Body: file,
    };

    try {
      const upload = s3
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
          console.log(
            `Uploading ${label}: ` + parseInt((evt.loaded * 100) / evt.total) + "%"
          );
        })
        .promise();

      await upload;
      alert(`${label} uploaded successfully.`);

      // Notify the user when the selfie is uploaded (triggers Lambda)
      if (label === "Selfie") {
        alert("Thank you, verifying your identity based on the uploaded images...");
      }
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
