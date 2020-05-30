const path = require('path');
const mali = require('mali');

const gRpcServer = new mali();

const driverslicenseProtoPath = path.resolve(__dirname, '../proto/driverslicense.proto');
const licenseplateProtoPath = path.resolve(__dirname, '../proto/licenseplate.proto');

gRpcServer.addService(driverslicenseProtoPath, 'DriversLicenseService');
gRpcServer.addService(licenseplateProtoPath, 'LicensePlateService');

module.exports = function (config) {

    function getLicense(param) {
        console.log(param.req);
        param.res = {
            uid: param.req.uid,
            firstName: 'Max',
            lastName: 'Mustermann',
            birthDate: {
                year: 1985,
                month: 4,
                day: 16
            },
            validUntil: {
                year: 2021,
                month: 4,
                day: 30
            }
        };
    }

    function isValid(param) {        
        console.log(param.req);
        param.res = {
            uid: param.req.uid,
            validUntil: {
                year: 2020,
                month: 10,
                day: 5
            },
            isValid: true
        };
    }

    /* Launch gRPC server */
    gRpcServer.use({
        getLicense,
        isValid
    });
    gRpcServer.start(config.INTERFACE + ':' + config.PORT_GRPC);
    console.log("gRPC Server running on port: " + config.PORT_GRPC);
}