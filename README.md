
# Project & Prerequisties Sotware

Name: ACTs

Technology Used:

Angular v19, NgModule, LazyLoading

Prerequisites:

    •	Node LTS
    •	nodejs
    •   mongodb
    •	Visual Studio
        o	ESLint Extension
        o   SonarLint

       

## Installation

  Install the necessary global packages:

  ```
  npm install -g @angular/cli
  
  ```
Clone the repository and navigate to the project directory:


## Backend:

```
  git clone "repo_url"
  cd pacts-be
  npm install
```
#### .env Setup

```
APP_PORT = 3000                                                 # App run port
DATABASE_URL = mongodb://localhost:27017/ACTs?retryWrites=false # mongodb url with db name
ACCESS_TOKEN_SECRET = test@Token123!@$                          # Cannot be changed in midway after initialized, may cause to reset pwd for all user
REFRESH_TOKEN_SECRET = test@Refresh123!@$                       # Cannot be changed in midway after initialized, may cause to reset pwd for all user
TOKEN_EXPIRY_IN_TIME = 30m                                      # Token Expiry for login user
REFRESH_TOKEN_EXPIRY_IN_TIME = 7d                               # Refresh Token Expirey for generated token
ADMIN_EMAIL = test@yopmail.com                                  # Admin user login username
ADMIN_PASSWORD = test123!@A                                     # Admin user login pwd
ADMIN_ID = 1                                                    # AdminID for seeder user
LOG_FLAG = 'true'                                               # Used to capture log for debug
LOG_LEVEL = info                                                # Default Log level
LOTTERYGEN = 17053                                              # Initial Activity Sheet No For Lottery Org
GAMINGGEN = 200940                                              # Initial Activity Sheet No For Gaming Org
UI_APP_URL = http://localhost:4200/                             # UI Front end URL used for reset/activate account
MAIL_EXPIRY_TIME = 15m                                          # Token expiry time used for reset/ activate account mail. Only as mintues format e.g 10m, 15m, 30m
SMTP_EMAIL_ID=  'HCL_admin@actsystem.com'                       # Mail sender from address used in SMPT mail configuration

```

#### Run Seeder for first time as below to create a pre-set data in db

```
node seeder // this cmd will run all the seeder file inside the pact-be/seeder
```

#### Note: Make sure you don't run the above commad twice, if you do then all the values and _id used for reference will be over written. Won't be able to audit

```
node seeder/filename.js // use this command with seeder filename to run the particular seeder file. If you create a new seeder follow this command to run the seeder in node.
```


Start the application on the web

```
npm run dev
```
    
