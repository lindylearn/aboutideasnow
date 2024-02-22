import { handleSubmit } from "../../common/formActions.js";

export const actions = {
    default: async ({ request }) => {
        return await handleSubmit(request);
    }
};
