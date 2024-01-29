import { COHERE_API_KEY } from "$env/static/private";
import { CohereClient } from "cohere-ai";

export const cohere = new CohereClient({
    token: COHERE_API_KEY
});
