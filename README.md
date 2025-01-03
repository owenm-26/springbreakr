# springbreakr
A BostonHacks 2024 project that won Best AI Application Built with Cloudflare. See our submission and demo [here](https://devpost.com/software/springbreakr)
## Introduction
Have you ever struggled with coming up with travel plans? Introducing Springbreakr, an AI-powered travel assistant! Give it a short description of what you are looking forward to do, and it will recommend a series of destinations from which you can pick and choose from! First, pick a recommended country which you want to visit, then pick from among a list of destinations specially tailored for you within that country!
## How it works
We are using the LLAMA LLM model hosted on a cloudflare worker to interpret user sentiment and recommend destinations. The frontend is built using Next.js, and the frontend and backend are connected through APIs we built in Flask. We also have a travel category prediction AI we trained using KNN, which we intended to use for user data anonymization. With this technique, we do not save user prompts directly in the database, only the category of their travel.
## How to run
```
// run backend logic
cd backend
pip install -r requirements.txt
python app.py

// run frontend
cd ../client
npm install
npm run dev
```
