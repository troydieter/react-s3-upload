# AnyCompany ID Verification System

This React application allows users to upload driver's license and selfie images for ID verification purposes.

<p align="center">
  <img src="preview.png" />
</p>

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

You will also need:
- A deployment of [the Amazon Rekognition Identity Verification sample repository](https://github.com/troydieter/amazon-rekognition-identity-verification) first. You'll use the output from this to feed the `.env` file for credentials.
- An AWS account

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/anycompany-id-verification.git
   cd anycompany-id-verification
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to a new file named `.env`:
     ```
     cp .env.example .env
     ```
   - Open the `.env` file and replace the placeholder values with your actual AWS credentials and S3 bucket information:
     ```
      REACT_APP_API_URL=https://example.execute-api.REGION.amazonaws.com/api
      REACT_APP_API_KEY=xyz123
     ```

## Running the Application

To start the development server:

```
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Building for Production

To create a production build:

```
npm run build
```

This command builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

To serve the production build locally:

```
npm install -g serve
serve -s build
```

## Usage

1. Open the application in a web browser.
2. You will see two upload boxes: one for the driver's license and one for the selfie.
3. Click "Choose File" to select an image for each category.
4. Click the "Verify Identity" button at the bottom for it to be processed.

## Troubleshooting

- Check that your AWS credentials in the `.env` file are correct and have the necessary permissions.
- If the application isn't picking up your environment variables, try restarting the development server.

## Security Note

This application handles sensitive information. Ensure that you follow best practices for securing your AWS credentials and protecting user data. Never commit your `.env` file to version control.

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## Licensing

The code in this project is licensed under MIT license.