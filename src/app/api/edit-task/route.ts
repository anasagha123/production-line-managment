import { apiPut } from "../database";

export async function PUT(req: Request) {
    const body = await req.json();
    const { id, entered_id, stage, recieved, finished, quantity } = body;

    const query = `
    UPDATE tasks 
    SET entered_id = ?, stage = ?, recieved = ?, finished = ?, quantity = ? 
    WHERE id = ?
  `;
    const values = [entered_id, stage, recieved, finished, quantity, id];

    let status, respBody;

    await apiPut(query, values)
        .then(() => {
            status = 200;
            respBody = { message: "Successfully patched task" };
        })
        .catch((err) => {
            status = 400;
            respBody = err;
        });
    return Response.json(respBody, {
        status,
    });
}