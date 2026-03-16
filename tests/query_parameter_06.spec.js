const { test, expect } = require("@playwright/test");
const postRequest = require("../test-data/post_request_body.json");

test("Query parameter in playwright api testing", async ({ request }) => {

  // Step 1: Create a booking so we have something to search for
  const postAPIResponse = await request.post("/booking", {
    data: postRequest,
  });

  // Validate POST succeeded
  expect(postAPIResponse.status()).toBe(200);

  // Extract the bookingid from POST response
  const postAPIResponseBody = await postAPIResponse.json();
  const bookingid = postAPIResponseBody.bookingid;
  console.log("Created booking ID:", bookingid);

  // Step 2: GET with query params to search by name
  const getAPIResponse = await request.get("/booking", { 
    params: {
      firstname: postRequest.firstname, 
      lastname: postRequest.lastname,
    },
  });

  // Parse .json() once into a variable
  const getAPIResponseBody = await getAPIResponse.json();
  console.log("Search results:", getAPIResponseBody);

  // Validate status
  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);

  // FIX : Response is an ARRAY of IDs — assert correctly
  expect(Array.isArray(getAPIResponseBody)).toBeTruthy();
  expect(getAPIResponseBody.length).toBeGreaterThan(0);

  // FIX: Confirm OUR booking ID is inside the results
  const allIds = getAPIResponseBody.map((b) => b.bookingid);
  expect(allIds).toContain(bookingid);
});