import { apiDelete } from "../database";

export async function DELETE(req: Request) {
    const body = await req.json();
    const { id } = body;

    const query = `
    DELETE FROM tasks WHERE id = ?
  `;
    const values = [id];

    let status, respBody;

    await apiDelete(query, values)
        .then(() => {
            status = 200;
            respBody = { message: "Successfully deleted task" };
        })
        .catch((err) => {
            status = 400;
            respBody = err;
        });
    return Response.json(respBody, {
        status,
    });
}