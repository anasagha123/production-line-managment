import { apiPost } from "../database";

export async function POST(req: Request) {
  const body = await req.json();
  const { entered_id, stage } = body;

  const query = `
    INSERT INTO tasks(entered_id, stage)
    VALUES(?, ?);
  `;
  const values = [entered_id, stage];

  let status, respBody;

  await apiPost(query, values)
    .then(() => {
      status = 200;
      respBody = { message: "Successfully created article" };
    })
    .catch((err) => {
      status = 400;
      respBody = err;
    });
  return Response.json(respBody, {
    status,
  });
}