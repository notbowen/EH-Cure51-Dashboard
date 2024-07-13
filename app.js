const { authenticate } = require('ldap-authentication')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json({ type: 'application/json' }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.post('/authenticate', async (req, res) => {
  const user = {}
  Object.assign(user, req.body)

  if (!user.username || !user.password) {
    return res.status(400).send('Missing username or password')
  }

  let options = {
    ldapOpts: {
      url: 'ldap://192.168.0.15',
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
