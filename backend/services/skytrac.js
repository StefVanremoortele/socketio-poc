
const soap = require('soap');
const Promise = require("bluebird");
const apiUrl = 'https://skywebapi.skytrac.ca/Webserviceapi/skywebservice.asmx?WSDL';
const apiKey = '5FEA3F4E-34D4-46A1-844C-7386F8062F18';
const apiUser = 'NHVOpsAPI';
const apiPass = 'Starflex1$';
const concurrency = 200;

async function getData() {
    let client = await soap.createClientAsync(apiUrl);
    client.clearSoapHeaders();
    client.addSoapHeader(getSoapHeader(apiKey));

    console.log('Authenticating to skytrac API');
    try {
        let a = await client.AuthenticateUserAsync({
            'tns:UserName': apiUser,
            'tns:Password': apiPass
        });
        let sessionId = a[0].AuthenticateUserResult;
        // let sessionId = '7f122150-72f3-11e9-80d4-485b3953e058'
        console.log('sessionId:', sessionId);

        client.clearSoapHeaders();
        client.addSoapHeader(getSoapHeader(apiKey, sessionId));

    } catch (error) {
        console.log(error);
        return;
    }

    console.log('GetAllUnitsInfo');
    try {
        var data = await client.GetAllUnitsInfoAsync({ 'tns:UserName': apiUser });
    } catch (error) {
        console.log(error)
        return;
    }
    if (data) {
        var assets = data[0].GetAllUnitsInfoResult.Asset;
    }

    console.log('Logging out from skytrac API');
    await client.LogoutAsync({});

    // return await Promise((resolve, reject) => {
    //     resolve(assets);
    // })
    return await Promise.map(assets, (async a => {
        return a;
    }), { concurrency });
}

function getSoapHeader(key, sessionId = '') {
    return `<tns:Authentication>
          <tns:SessionID>${sessionId}</tns:SessionID>
          <tns:LicenseKey>${key}</tns:LicenseKey>
          <tns:Version>1.0</tns:Version>
          </tns:Authentication>`
}

module.exports = { getData };
