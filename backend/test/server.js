const expect  = require("chai").expect;
const request = require("request");

describe("MS_Strassenverkehrsamt  API", function() {
    describe("Routes", function() {
        const RestUrl = "http://localhost:9999" + "/alive";
        it("REST Server alive", function() {
            request(RestUrl, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });
    });
});