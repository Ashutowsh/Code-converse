import { createProjectSchema } from "@/schemas/createProjectSchema";
import { protectedProcedures, router } from "./trpc";

export const appRouter = router({
    createProject: protectedProcedures.input(createProjectSchema)
    .mutation(async({ctx, input}) => {
        
    })
});

export type AppRouter = typeof appRouter;