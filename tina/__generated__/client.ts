import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ cacheDir: 'E:/awesomeProject/Mak-s-Bolg/tina/__generated__/.cache/1780538118557', url: 'http://localhost:4001/graphql', token: '', queries,  });
export default client;
  