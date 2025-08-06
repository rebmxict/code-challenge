import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { postcode, streetnumber },
  } = req;

  if (!postcode || !streetnumber) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  if (postcode.length < 4) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
    });
  }

  /** TODO: Implement the validation logic to ensure input value
   *  is all digits and non negative
   */
  const isStrictlyNumeric = (value: string) => {
    return /^\d+$/.test(value);
  };

  const validateNumericField = (
    name: string,
    value: string,
    res: NextApiResponse
  ): boolean => {
    if (!isStrictlyNumeric(value)) {
      res.status(400).send({
        status: "error",
        errormessage: `${name} must be all digits and non negative!`,
      });
      return false;
    }
    return true;
  };

  /** TODO: Refactor the code below so there is no duplication of logic for postCode/streetNumber digit checks. */
  // if (!isStrictlyNumeric(postcode as string)) {
  //   return res.status(400).send({
  //     status: "error",
  //     errormessage: "Postcode must be all digits and non negative!",
  //   });
  // }

  // if (!isStrictlyNumeric(streetnumber as string)) {
  //   return res.status(400).send({
  //     status: "error",
  //     errormessage: "Street Number must be all digits and non negative!",
  //   });
  // }

  if (
    !validateNumericField("Postcode", postcode as string, res) ||
    !validateNumericField("Street Number", streetnumber as string, res)
  ) {
    return;
  }

  const mockAddresses = generateMockAddresses(
    postcode as string,
    streetnumber as string
  );
  if (mockAddresses) {
    const timeout = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // delay the response by 500ms - for loading status check
    await timeout(500);
    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
