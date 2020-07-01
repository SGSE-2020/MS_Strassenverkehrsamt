const expect  = require("chai").expect;
const request = require("request");

const config = {
    INTERFACE: "0.0.0.0",
    PORT_REST: 8080,
    PORT_GRPC: 50051
};

const restAPI = require('../components/api_rest')(config);

describe("MS_Strassenverkehrsamt API", function() {
    describe("Routes", function() {
        const RestUrl = "http://localhost:8080" + "/alive";
        it("REST Server alive", function() {
            request(RestUrl, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });
    });
});