import {Octokit} from "octokit";
import prismaDb from "./prisma";
import env from "./env";

export const octokit = new Octokit({
    auth : env.gitHub.token
})

type CommitResponse = {
    commitHash : string,
    commitMessage : string,
    commitAuthorName : string,
    commitAuthorAvatar: string,
    commitData: string
}

const fetchProjectGithubUrl = async (projectId : string) => {
    const project = await prismaDb.project.findUnique({
        where : {
            id : projectId
        },
        select : {
            githubUrl : true
        }
    })

    if(!project?.githubUrl) throw new Error("Project has no github url.")

    return {project, githubUrl : project?.githubUrl}
}

export const getCommitHashes = async(githubUrl : string): Promise<CommitResponse[]> => {
    const [owner, repo] = githubUrl.split('/').slice(-2)
    if(!owner || !repo) {
        throw new Error("Invalid Github url.")
    }
    const {data} = await octokit.rest.repos.listCommits({
        owner,
        repo
    })

    const sortedCommits = data.sort((a:any, b:any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author?.date).getTime()) as any
    
    return sortedCommits.slice(0, env.limit.nCommits).map((commit : any) => ({
        commitHash : commit.sha as string,
        commitMessage : commit.commit?.message ?? "",
        commitAuthorName : commit.commit?.author?.name ?? "",
        commitAuthorAvatar : commit?.author?.avatar_url ?? "",
        commitDate : commit.commit?.author?.date ?? ""
    }))
}

export const pollCommits = async(projectId : string) => {
    const {project, githubUrl} = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)

    const unprocessedCommits = await filterunprocessedCommits(projectId, commitHashes)
    return unprocessedCommits
}

const filterunprocessedCommits = async(projectId: string, commitHashes: CommitResponse[]) => {
    const processedCommit = await prismaDb.commit.findMany({
        where : {projectId}
    })

    const unprocessedCommits = commitHashes.filter((commit) => processedCommit.some((processedCommit) => processedCommit.commitHash === commit.commitHash))

    return unprocessedCommits
}

