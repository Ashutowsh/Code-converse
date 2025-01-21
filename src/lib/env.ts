const env = {
    clerk : {
        publishableKey : String(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
        secretKey : String(process.env.CLERK_SECRET_KEY)
    },
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