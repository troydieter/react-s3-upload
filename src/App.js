import AWS from "aws-sdk";
import { useState, useEffect } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [s3, setS3] = useState(null);

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

  const uploadFile = async () => {
    if (!s3 || !file) return;

    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    try {
      const upload = s3.putObject(params).on("httpUploadProgress", (evt) => {
        console.log(
          "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
        );
      }).promise();

      await upload;
      alert("File uploaded successfully.");
    } catch (err) {
      console.error(err);
      alert("An error occurred while uploading the file.");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="App">
      <div className="upload-container">
        <div className="upload-box">
          <h2>Upload Your File</h2>
          <input type="file" onChange={handleFileChange} />
          <button onClick={uploadFile}>Upload</button>
        </div>
      </div>
    </div>
  );
}

export default App;
