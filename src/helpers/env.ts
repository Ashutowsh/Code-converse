const env = {
    gitHub : {
        token : String(process.env.GITHUB_TOKEN)
    },
    limit : {
        nCommits : String(process.env.NO_OF_COMMITS)
    }, 
    ai : {
        apiKey : String(process.env.GOOGLE_GEMINI_API_KEY)
    }
}

export default env