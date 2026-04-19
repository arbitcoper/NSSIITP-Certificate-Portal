# NSS IITP Certificate Generator

This is a Next.js web app used to generate participation certificates for NSS IIT Patna volunteers. It takes a base Canva template and overlays the student's name directly onto it using HTML5 Canvas.

### Running it locally

If you're on Windows, you can just double click `start.bat`. 
Otherwise, run the standard npm commands:

```bash
npm install
npm run dev
```

The server will start at http://localhost:3000.

### Adding students
All student data is pulled directly from `data/students.csv`. 
To add new volunteers, just add their roll number and name to the CSV file. 
```csv
RollNo,Name
2301CS01,Abhiraj
```

### Updating the certificate design
If the certificate design changes next year, export it from Canva as a transparent PNG and replace `public/certificate-template.png`.

If the blank line for the name has moved, you'll need to update the coordinates. I built a visual calibration tool for this:
1. Run the dev server
2. Go to http://localhost:3000/calibrate
3. Click on the center of the blank line
4. Copy the coordinates it gives you into `cert.config.js`

### Deployment
This project is configured to deploy seamlessly on Vercel.
Since `students.csv` is parsed on the backend at request time, the `vercel.json` file ensures that the CSV is bundled into the serverless function. 

Just push this repository to your GitHub, import it in Vercel, and hit deploy. Vercel will auto-detect Next.js and handle the rest. If you update the CSV later on, pushing the changes to `main` will automatically update the live site.