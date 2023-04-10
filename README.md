# Coding Challenge Frontend

##  Clone the repo
Clone the repo from github [https://github.com/davidcer/tn-frontend](https://github.com/davidcer/tn-frontend)

## Instll all dependencies
Run on your project directory
```bash
npm install
```
## Set-up script to start-backend
On package.json find the key: "start-backend" and set it to run according to your folder structure
```bash
"cd .. && cd backend && venv/bin/flask run --no-debugger"
```
If by any chance you set Backend to run on a port different that 5000, update proxy server on package.json
```node
"proxy": "http://localhost:5000"
```

## Start application
```bash
npm start
```
## Log In
To log-in you will need first to set credentials on backend


# Pendings tasks - (this is an ongoing process)

* Implement tests
* Expand filters over record
* Enhance options over random word generator
* Enhance experience (enable and disable components, implement progress bars)

