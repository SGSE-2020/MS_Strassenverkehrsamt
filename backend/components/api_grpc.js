const path = require('path');
const mali = require('mali');

const gRpcServer = new mali();

const driverslicenseProtoPath = path.resolve(__dirname, '../proto/driverslicense.proto');
const licenseplateProtoPath = path.resolve(__dirname, '../proto/licenseplate.proto');

gRpcServer.addService(driverslicenseProtoPath, 'DriversLicenseService');
gRpcServer.addService(licenseplateProtoPath, 'LicensePlateService');

var LicensePlateRegex = /^SC\s[A-Z]{1,2}\s\d{1,4}$/;

module.exports = function (config, messageService, databaseService) {

    async function getLicense(param) {
        console.log("GRPC CALL: DriversLicenseService -> getLicense");

        let DriversLicense = {
            uid: null,
            firstName: null,
            lastName: null,
            birthDate: null,
            validUntil: null,
            isValid: null
        };

        try {

            let result = await databaseService.getDB().collection("accounts").findOne({
                _id: param.req.uid
            }, {
                projection: {
                    license: 1,
                    firstName: 1,
                    lastName: 1,
                    birthDate: 1
                }
            });

            if (result) {                
                var validTest = false;
                if (Date.now() < result.license.validUntil) {
                    validTest = true
                }

                var birthDate = new Date(result.birthDate)

                DriversLicense = {
                    uid: param.req.uid,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    birthDate: {
                        year: birthDate.getFullYear(),
                        month: birthDate.getMonth() + 1,
                        day: birthDate.getDate()
                    },
                    validUntil: result.license.validUntil,
                    isValid: validTest
                };
            }

            param.res = DriversLicense;
        } catch (error) {            
            console.log("internal error")
            param.res = {
                uid: null,
                firstName: null,
                lastName: null,
                birthDate: null,
                validUntil: null,
                isValid: null
            };
        }
    }

    async function getLicensePlate(param) {
        console.log("GRPC CALL: LicensePlateService -> getLicensePlate");

        let LicensePlate = {
            id: null,
            validUntil: null,
            isValid: null,
            uid: null
        }

        try {
            if (LicensePlateRegex.test(param.req.id)) {
                // pattern matches

                var parts = param.req.id.split(" ")
                var queryPlateId = {
                    city: parts[0],
                    alpha: parts[1],
                    number: parts[2]
                }

                var query = {
                    plates: {
                        $elemMatch: {
                            plateId: queryPlateId
                        }
                    }
                };

                let result = await databaseService.getDB().collection("accounts").findOne(query, {
                    projection: {
                        plates: 1,
                        _id: 1
                    }
                });
                if (result) {
                    // found
                    result.plates.forEach(plate => {
                        if (plate.plateId.city == queryPlateId.city && plate.plateId.alpha == queryPlateId.alpha && plate.plateId.number == queryPlateId.number) {
                            var validTest = false;
                            if (Date.now() < plate.validUntil) {
                                validTest = true
                            }

                            LicensePlate = {
                                id: queryPlateId.city + " " + queryPlateId.alpha + " " + queryPlateId.number,
                                validUntil: plate.validUntil,
                                isValid: validTest,
                                uid: result._id
                            };
                        }
                    });
                }
            } else {
                // pattern does not match
            }
            param.res = LicensePlate;
        } catch (error) {
            console.log("internal error")
            param.res = {
                id: null,
                validUntil: null,
                isValid: null,
                uid: null
            };
        }
    }

    /* Launch gRPC server */
    gRpcServer.use({
        getLicense,
        getLicensePlate
    });
    gRpcServer.start(config.INTERFACE + ':' + config.PORT_GRPC);
    console.log("gRPC Server running on port: " + config.PORT_GRPC);
}