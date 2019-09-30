declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string 
        MONGODB_URI:string
        JWT_SECRET: string,
        FACEBOOK_CLIENT_ID:string
        FACEBOOK_SECRET:string
        GOOGLE_CLIENT_ID:string
        GOOGLE_SECRET:string
        GITHUB_CLIENT_ID:string
        GITHUB_SECRET:string
    }
}
