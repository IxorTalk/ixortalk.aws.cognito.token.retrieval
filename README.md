```
  _____             _______    _ _             __          _______       _____                  _ _                 ___          _________
 |_   _|           |__   __|  | | |           /\ \        / / ____|     / ____|                (_) |               | \ \        / /__   __|
   | | __  _____  _ __| | __ _| | | __       /  \ \  /\  / / (___      | |     ___   __ _ _ __  _| |_ ___          | |\ \  /\  / /   | |
   | | \ \/ / _ \| '__| |/ _` | | |/ /      / /\ \ \/  \/ / \___ \     | |    / _ \ / _` | '_ \| | __/ _ \     _   | | \ \/  \/ /    | |
  _| |_ >  < (_) | |  | | (_| | |   <      / ____ \  /\  /  ____) |    | |___| (_) | (_| | | | | | || (_) |   | |__| |  \  /\  /     | |
 |_____/_/\_\___/|_|  |_|\__,_|_|_|\_\    /_/    \_\/  \/  |_____/      \_____\___/ \__, |_| |_|_|\__\___/     \____/    \/  \/      |_|

```

# Introduction

Simple CLI tool to interact with Cognito user pools.

Will print out the JWT token based on a Cognito username / password

# Installation

Module can be installed globally via

```
npm install -g @ixor/aws.cognito.token.retrieval
```

# Preperation

Before you can start using the CLI, you'll need to provide 2 JSON config files

- ${USER_HOME}/.ixortalk.aws.cognito/cognito-env.json
- ${USER_HOME}/.ixortalk.aws.cognito/users.json

These will define your cognito environments and your users.

# Config files

## Cognito environments

You can define 1 or more cognito environments using the following syntax.

```
{
  "dev": {
    "UserPoolId": "eu-central-1_xxxxxx",
    "ClientId": "xxxxxxxxxxxxxx",
    "IdentityPoolId": "eu-central-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "AWSRegion": "eu-central-1"
  },
  "test": {
    "UserPoolId": "eu-central-1_xxxxxx",
    "ClientId": "xxxxxxxxxxxxxx",
    "IdentityPoolId": "eu-central-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "AWSRegion": "eu-central-1"
  },
  "prod": {
    "UserPoolId": "eu-central-1_xxxxxx",
    "ClientId": "xxxxxxxxxxxxxx",
    "IdentityPoolId": "eu-central-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "AWSRegion": "eu-central-1"
  }
}
```

Define these environments in `${USER_HOME}/.ixortalk.aws.cognito/cognito-env.json`

## User environments

You can define 1 or more users using the following syntax.


```
{
  "admin": {
    "Password": "SecretPwd_123",
    "email": "admin@acme.corp"
  },
  "user": {
    "Password": "SecretPwd_123",
    "email": "user@acme.corp"
  }
}
```

Define these users in `${USER_HOME}/.ixortalk.aws.cognito/users.json`

# Usage

```
cognito-login -h

  Usage: cognito-login [options]


  Options:

    -V, --version                    output the version number
    -e, --environment <environment>  The aws cognito environment
    -u, --username <username>        The username
    -p, --password <password>        The password (when not provided, the one from the config will be used) 
    -h, --help                       output usage information
```



# Example

To retrieve the JWT token for the admin user for your AWS cognito dev environment.
If your users file already contains the admin user, you can ommit the password.)

Simply copy / paste the export line at the end of the output and use the `$TOKEN` variable in your scripting 
```
cognito-login -e dev -u admin -p SecretPwd_123

  _____             _______    _ _             __          _______       _____                  _ _                 ___          _________
 |_   _|           |__   __|  | | |           /\ \        / / ____|     / ____|                (_) |               | \ \        / /__   __|
   | | __  _____  _ __| | __ _| | | __       /  \ \  /\  / / (___      | |     ___   __ _ _ __  _| |_ ___          | |\ \  /\  / /   | |
   | | \ \/ / _ \| '__| |/ _` | | |/ /      / /\ \ \/  \/ / \___ \     | |    / _ \ / _` | '_ \| | __/ _ \     _   | | \ \/  \/ /    | |
  _| |_ >  < (_) | |  | | (_| | |   <      / ____ \  /\  /  ____) |    | |___| (_) | (_| | | | | | || (_) |   | |__| |  \  /\  /     | |
 |_____/_/\_\___/|_|  |_|\__,_|_|_|\_\    /_/    \_\/  \/  |_____/      \_____\___/ \__, |_| |_|_|\__\___/     \____/    \/  \/      |_|
                                                                                     __/ |
                                                                                    |___/

awsEnvironment : 
 { UserPoolId: 'eu-central-1_0VEinu0cg',
  ClientId: 'm6uu1npo6fpt4oeitb6a7475m',
  IdentityPoolId: 'eu-central-1:68f40db0-62e8-44f2-9a29-7b4658aa747b',
  AWSRegion: 'eu-central-1' }

user : 
 admin

credential : 
 { Password: 'SecretPwd_123' }


export TOKEN=eyJraWQiOiIxRWpWRXlNR3BYXC9jV0J5eTVtYlFEWW0wR0lhTjF2eVlYT1pLNkZtSTJ3Yz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiNDgwZTQxNi1kYmNhLTQ4NjktYTU4OC1mZjdjODJmY2ZiYWEiLCJhdWQiOiJtNnV1MW5wbzZmcHQ0b2VpdGI2YTc0NzVtIiwiY29nbml0bzpncm91cHMiOlsiQWRtaW4iXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTA0NDQ5NjkyLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV8wVkVpbnUwY2ciLCJjb2duaXRvOnVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE1MDQ0NTMyOTIsImlhdCI6MTUwNDQ0OTY5MiwiZW1haWwiOiJkZGV3YWVsZUBnbWFpbC5jb20ifQ.EFVf4oVyAdJ7Zs_763OG69YsX8ss13Fy1MjzcvWfAFOlbP4F0RvqTolOif8szaPhG5FFf-TlGkfaEX3gulJfXU8cS-7WIf8BmQ9NnkUNmXxjmPo5wmCFzaj__rNqWM9D22vaaTCBfffmNI-EQ6PL0nTIzcSGNB7rr59VRYQ1B-5zoKDNNSwdtiBjxCppjLGs1-C_7tnW6EAenq2DUSlRYIt-kzQR7OjhkHsOI20pyHlv_SY5hCMHSHI6jdEuqqtqUbKG8JlPmx9WC9SEencEIlB0KMjVZl3qGi8wlqvGn8GrSwunkGSUNnpoyL97ohdIH2W1Di8quURwdqO0qwa2Ow
```

You can then use these tokens like this

```
curl -v -H "Authorization: $TOKEN" <some rest endpoint>
```

# License

```
The MIT License (MIT)

Copyright (c) 2016-present IxorTalk CVBA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```