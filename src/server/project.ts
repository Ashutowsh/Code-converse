import { protectedProcedures, router } from "./trpc";
import prismaDb from "@/lib/prisma";
import { createProjectSchema } from "@/schemas/createProjectSchema";

export const appRouter = router({
    createProject: protectedProcedures.input(createProjectSchema)

    .mutation(async({ctx, input}) => {
        // console.log(" Input : ", input)
        const user = ctx?.user
        const newProject = await prismaDb.project.create({
            data : {
                title : input.projectTitle,
                githubUrl : input.githubUrl,
                githubToken : input.githubToken,
                
                usersToProjects : {
                    create : {
                        userId : user.userId!,
                    }
                }
            }
        })
        console.log(newProject)
        return newProject
    }),

    getProjects : protectedProcedures.query(async ({ctx}) => {
       const user = ctx.user

       const projects = await prismaDb.project.findMany({
        where : {
            usersToProjects : {
                some : {
                    userId : user.userId!
                }
            }, deletedAt : null
        }
       })

       return projects
    })
});

export type AppRouter = typeof appRouter;