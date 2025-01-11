import {createTRPCReact} from "@trpc/react-query"
import { type AppRouter } from "@/server/project"

export const trpc = createTRPCReact<AppRouter>();