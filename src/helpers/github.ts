import {Octokit} from "octokit";
import prismaDb from "./prisma";
import env from "./env";
import axios from "axios"
import { aiSummarise } from "./ai";

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
    const summaryResponse = await Promise.allSettled(unprocessedCommits.map((commit)=> {
        return summariseCommit(githubUrl, commit.commitHash)
    } ))

    const summarises = summaryResponse.map((response) => {
        if(response.status === 'fulfilled') {
            return response.value as string
        }
        return ""
    })

    const commits = await prismaDb.commit.createMany({
        data : summarises.map((summary, index) => {
            return {
                projectId: projectId,
                commitHash : unprocessedCommits[index].commitHash,
                commitMessage: unprocessedCommits[index].commitMessage,
                commitAuthorAvatar: unprocessedCommits[index].commitAuthorAvatar,
                commitAuthorName: unprocessedCommits[index].commitAuthorName,
                commitData: unprocessedCommits[index].commitData,
                summary
            }
        })
    })

    return commits
}

async function summariseCommit(githubUrl: string, commitHash: string) {

    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers : {
            Accept : 'application/vnd.github.v3.diff'
        }
    })

    return aiSummarise(data) || ""
}

const filterunprocessedCommits = async(projectId: string, commitHashes: CommitResponse[]) => {
    const processedCommit = await prismaDb.commit.findMany({
        where : {projectId}
    })

    const unprocessedCommits = commitHashes.filter((commit) => processedCommit.some((processedCommit) => processedCommit.commitHash === commit.commitHash))

    return unprocessedCommits
}

