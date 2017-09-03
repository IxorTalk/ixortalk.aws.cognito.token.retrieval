#!/usr/bin/env node
var AWS = require('aws-sdk');
var AWSCognito = require('amazon-cognito-identity-js');
var util = require('util');
var request = require('request');
var rp = require('request-promise');
var readline = require('readline');
var fs = require('fs');
var os = require('os');

var program = require('commander');

program
    .version('0.0.1')
    .option('-e, --environment <environment>', 'The AWS cognito environment')
    .option('-u, --username <username>', 'The username')
    .option('-p, --password <password>', 'The password  (when not provided, the one from the config will be used)')
    .parse(process.argv);



console.log(fs.readFileSync('resources/banner.txt', 'utf8'));

var awsEnvironments = {};


try {
    var fileContents = fs.readFileSync(os.homedir() + '/.ixortalk.aws.cognito/cognito-env.json', 'utf8')
    awsEnvironments = JSON.parse(fileContents);
} catch (err) {
    console.log ("No cognito environment file found in " + os.homedir() + "/.ixortalk.aws.cognito/");
    program.help()
}

try {
    var fileContents = fs.readFileSync(os.homedir() + '/.ixortalk.aws.cognito/users.json', 'utf8')
    credentialList = JSON.parse(fileContents);
} catch (err) {
    console.log ("No users file found in " + os.homedir() + "/.ixortalk.a   ws.cognito/");
    program.help()
}

if (!program.environment) {
    console.log ("No valid environment specified.");
    program.help()
}

var awsEnvironment = awsEnvironments[program.environment];


if (!awsEnvironment) {
    console.log ("Environment " + program.environment + " not found.");
    program.help()
}

if (!program.username) {
    console.log ("No username provided");
    program.help()
}

var credentials = credentialList[program.username];

if (!credentials) {
    if (!program.password) {
        console.log("No password provided for {}",program.username)
        program.help()
    } else {
        credentials = {Password: program.password}
    }
} else {
    if (program.password) {
        credentials = {Password: program.password}
    }
}

console.log("\nawsEnvironment : \n",awsEnvironment)
console.log("\nuser : \n",program.username)
console.log("\ncredential : \n",credentials)

AWS.config.update({region: awsEnvironment.AWSRegion});

var authenticationData = {
    Username : program.username,
    Password : credentials.Password
};
var authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);

var poolData = {
    UserPoolId : awsEnvironment.UserPoolId,
    ClientId : awsEnvironment.ClientId
};
var userPool = new AWSCognito.CognitoUserPool(poolData);


var userData = {
    Username : program.username,
    Pool : userPool
};

var cognitoUser = new AWSCognito.CognitoUser(userData);


// cognitoUser.forgotPassword({
//     onSuccess: function (result) {
//         console.log('call result: ' + result);
//     },
//     onFailure: function(err) {
//         console.log('call err: ' + err);
//     },
//     inputVerificationCode() {
//         console.log("Entering verification code..")
//
//         const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout
//         });
//
//         rl.question('Please enter your verification code ', (verificationCode) => {
//             console.log("You entered : ${verificationCode}");
//             rl.close();
//             var newPassword = "AdminAdmin_123"
//             cognitoUser.confirmPassword(verificationCode, newPassword, this);
//         });
//
//     }
// });


cognitoUser.authenticateUser(authenticationDetails, {

    onSuccess: function (result) {

        cognitoUserPoolLoginProvider = 'cognito-idp.' + awsEnvironment.AWSRegion +  '.amazonaws.com/' + awsEnvironment.UserPoolId;
        var logins = {};
        logins[cognitoUserPoolLoginProvider] = result.getIdToken().getJwtToken();

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId : awsEnvironment.IdentityPoolId,
            Logins : logins
        });

        console.log("\n\nexport TOKEN=" + result.getIdToken().getJwtToken())

    },

    onFailure: function(err) {
        console.log("Error authenticating ! ",err);
    },


    // When the user is in a FORCE_CHANGE_PASSWORD state, the user needs to enter a new password.
    // Hence this function. By default we will simply set the same password again.

    newPasswordRequired: function(userAttributes, requiredAttributes) {

        cognitoUser.completeNewPasswordChallenge(credentials.Password,  {email: userAttributes.email}, {

                onSuccess: function (result) {
                },

                onFailure: function (error) {
                    console.error(error.message)
                }
            }
        )
    }

});
