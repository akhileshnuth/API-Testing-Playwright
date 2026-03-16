const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");       // ✅ FIX 1: use require, not import
const { DateTime } = require("luxon");

const postRequestBody = require("../test-data/post_request_body.json");

test("Create POST api request using dynamic request body in playwright", async ({
  request,
}) => {
  // Override just the dynamic fields using Faker + Luxon
  const requestBody = {
    ...postRequestBody,                              // spread the base data from JSON
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int(1000),
    bookingdates: {
      checkin: DateTime.now().toFormat("yyyy-MM-dd"),
      checkout: DateTime.now().plus({ days: 5 }).toFormat("yyyy-MM-dd"), //
    },
  };

  const postAPIResponse = await request.post("/booking", {
    data: requestBody,
  });

  // ✅ FIX: call .json() ONCE, save it, then log
  const postAPIResponseBody = await postAPIResponse.json();
  console.log(postAPIResponseBody);

  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  expect(postAPIResponseBody.booking).toHaveProperty("firstname", requestBody.firstname);
  expect(postAPIResponseBody.booking).toHaveProperty("lastname", requestBody.lastname);

  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkin",
    requestBody.bookingdates.checkin
  );
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkout",
    requestBody.bookingdates.checkout
  );
});