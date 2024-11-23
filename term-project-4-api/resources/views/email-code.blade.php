<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
    <style>
        body {
            display: flex;
            justify-content: center;  /* Horizontally center the content */
            align-items: center;      /* Vertically center the content */
            height: 100vh;            /* Full viewport height */
            margin: 0;
            background-color: #f8f9fa; /* Light background color */
        }

        .container {
            text-align: center;       /* Center the text inside the container */
            padding: 20px;
            background-color: white;  /* White background for the container */
            border-radius: 10px;      /* Add corner radius */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for elevation */
            width: 100%;              /* Full width */
            max-width: 400px;         /* Limit the maximum width of the container */
        }

        p {
            font-size: 16px;          /* Adjust the font size */
            color: #333;              /* Darker text color */
            margin-bottom: 15px;      /* Spacing between paragraphs */
        }

        strong {
            font-weight: bold;        /* Bold the verification code */
            color: #007bff;           /* Color the code in a distinct blue */
        }
    </style>
</head>
<body>

    <div class="container">
        <p>Hello,</p>
        <p>Your verification code is: <strong>{{ $randomCode }}</strong></p>
        <p>Please use this code to complete your verification process.</p>
    </div>

</body>
</html>

