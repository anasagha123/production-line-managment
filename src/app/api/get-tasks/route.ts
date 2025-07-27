import { apiGet } from "../database";

export async function GET() {

    const query = `
    SELECT * from tasks
  `;

    let status, body;
    try {
        await apiGet(query)
            .then((res) => {
                status = 200;
                body = res;
            })
            .catch((err: Error) => {
                status = 400;
                body = { error: err };
            });
        return Response.json(body, {
            status,
        });
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error(e.message);
            return Response.json(
                { error: e.message },
                { status: 500 }
            );
        } else {
            console.error("An unexpected error occurred:", e);
            return Response.json(
                { error: "An unknown error occurred." },
                { status: 500 }
            );
        }
    }
}