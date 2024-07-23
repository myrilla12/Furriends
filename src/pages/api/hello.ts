// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

/**
 * API route handler that responds with a JSON object containing a name.
 *
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse<Data>} res - The API response object.
 * @returns {void} The response object with a status of 200 and a JSON object containing a name.
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({ name: "John Doe" });
}
