# Cure51 Project Tracker

A vulnerable Node.JS web server set up for the Ethical
Hacking module under Ngee Ann Polytechnic's
Diploma in Cybersecurity & Digital Forensics
second year curriculum.

## Setup Instructions

1. Clone the repository
2. Install Docker
3. Create a SSL certificate at [ZeroSSL](https://zerossl.com/)
4. Create a folder called `keys` and place the SSL certificates there
5. Build the container using `docker build -t cure51 .`
6. Run the container with `docker run -p 443:443 cure51`

## Running the Exploit

1. Deploy a reverse shell on your computer via `nc -lvnp PORT`
2. Replace the variables `REVSHELL_IP` and `REVSHELL_PORT` with the corresponding values
3. If your computer is not directly exposed to the internet, you can use [ngrok](https://ngrok.com/) to start a reverse TCP tunnel and replace the `REVSHELL_IP` with ngrok's IP, and `REVSHELL_PORT` with ngrok's port.

## Technical Details

This is a Node.JS web server that uses Express.JS to
simulate a project tracker for a fictional company
named Cure51. It uses Node.JS version 12 which happens
to contain [this](https://github.com/nodejs/node/blob/02aa8c22c26220e16616a88370d111c0229efe5e/lib/child_process.js#L138)
line of code in it's `fork` function.

```js
options = { ...options, shell: false };
```

The server takes in the user's input in JSON format
and parses it with BodyParser's JSON parser. The
server then merges **all** the properties with an
empty object, giving rise to a prototype pollution
vulnerability.

The code calls `fork`, which contains the line of code
shown above. When combined with the prototype pollution
vulnerability, it allows an attacker to achieve RCE on
the webserver by overwriting special variables that
allow for arbitrary code execution. Refer to
[this](https://book.hacktricks.xyz/pentesting-web/deserialization/nodejs-proto-prototype-pollution/prototype-pollution-to-rce)
guide and a Google search on prototype pollution
vulnerabilities for a more detailed explanation.
