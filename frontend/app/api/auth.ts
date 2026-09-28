import api from "~/api/request";

export async function login() {
  const resp = await api.post("/login", (req: Request, res: Response) => {

  })
  return resp.data
}