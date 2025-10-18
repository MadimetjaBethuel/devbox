import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const repoRouter = createTRPCRouter({
    list: publicProcedure.query(async ({ ctx }) => {
        const repos = await ctx.octokit.rest.repos.listForAuthenticatedUser();
        return repos.data;
    }),
}); 

