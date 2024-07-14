const { fork } = require('child_process')
const { authenticate } = require('ldap-authentication')
const https = require('https')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const options = {
    key: fs.readFileSync('keys/private.key'),
    cert: fs.readFileSync('keys/certificate.crt'),
}

app.use(bodyParser.json({ type: 'application/json' }))
app.use(express.static('public'))

function isObject(obj) {
  return typeof obj === 'function' || typeof obj === 'object';
}

function merge(target, source) {
  for (let key in source) {
    if (isObject(target[key]) && isObject(source[key])) {
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.post('/authenticate', async (req, res) => {
  const user = {}
  merge(user, req.body)

  const logProcess = fork('./logAuth.js')
  logProcess.send({ username: user.username, ipAddress: req.ip })

  if (!user.username || !user.password) {
    return res.status(400).send('Missing username or password')
  }

  let options = {
    ldapOpts: {
      url: 'ldap://10.0.0.5',
    },
    userDn: `cn=${user.username},cn=users,dc=cure51,dc=com`,
    userPassword: user.password,
    userSearchBase: 'dc=cure51,dc=com',
    usernameAttribute: 'cn',
    username: user.username,
    attributes: ['userPrincipalName']
  }

  try {
    let auth_user = await authenticate(options)
    return res.send(auth_user)
  } catch (err) {
    return res.status(500).send(err)
  }
})

https.createServer(options, app).listen(443)
