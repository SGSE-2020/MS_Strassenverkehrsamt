const expect  = require("chai").expect;
const request = require("request");
const server = require("../server");

describe("MS_Strassenverkehrsamt  API", function() {
    describe("Routes", function() {
        const RestUrl = "http://localhost:8080" + "/alive";
        it("REST Server alive", function() {
            request(RestUrl, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });
    });
});