import { Redis } from "@upstash/redis";
import { CohereEmbeddings } from "@langchain/cohere";
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone';
import { PineconeStore } from "@langchain/pinecone";

export type CharacterKey = {
    characterName: string;
    modelName: string;
    userId: string;
};

export class MemoryManager {
    private static instance: MemoryManager
    private history: Redis;
    private vectorDBClient: PineconeClient;

    public constructor(){
        this.history = Redis.fromEnv();
        this.vectorDBClient = new PineconeClient({apiKey: process.env.PINECONE_API_KEY!});
    }

    public async vectorSearch(recentChatHistory: string, characterFileName: string) {
        const pineconeClient = <PineconeClient>this.vectorDBClient;
        const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX!);

        const vectorStore = await PineconeStore.fromExistingIndex(
            new CohereEmbeddings({apiKey: process.env.COHERE_API_KEY!, model: "embed-multilingual-v3.0"}),
            { pineconeIndex, textKey: "pageContent" }
        );

        const similarDocs = await vectorStore
            .similaritySearch(recentChatHistory, 3, { fileName: characterFileName })
            .catch((err) => console.log("Failed to get vector search results", err));

        return similarDocs;
    }

    //Singleton (SDA) - lazy initialization
    public static async getInstance(): Promise<MemoryManager> {
        if(!MemoryManager.instance){
            MemoryManager.instance = new MemoryManager();
        }

        return MemoryManager.instance;
    }

    private generatedRedisCharacterKey(characterKey: CharacterKey): string {
        return `${characterKey.characterName}-${characterKey.modelName}-${characterKey.userId}`
    }

    public async writeToHistory(text: string, characterKey: CharacterKey){
        if(!characterKey || typeof characterKey.userId == 'undefined'){
            console.log("Character key set incorrectly");
            return "";
        }

        const key = this.generatedRedisCharacterKey(characterKey);
        const result = await this.history.zadd(key, {
            score: Date.now(),
            member: text,
        });

        const model = new CohereEmbeddings({ apiKey: process.env.COHERE_API_KEY!, model: "embed-multilingual-v3.0" });
        const vector = await model.embedQuery(text);
        
        const pineconeIndex = this.vectorDBClient.Index(process.env.PINECONE_INDEX!);
        await pineconeIndex.upsert([
            {
                id: key + '-' + Date.now(),
                values: vector,
                metadata: { fileName: characterKey.characterName, pageContent: text },
            }
        ]);

        return result;
    }

    public async readLatestHistory(characterKey: CharacterKey): Promise<string> {
        if(!characterKey || typeof characterKey.userId == 'undefined'){
            console.log("Character key set incorrectly");
            return "";
        }

        const key = this.generatedRedisCharacterKey(characterKey);
        let result = await this.history.zrange(key, 0, Date.now(), {
            byScore: true,
        });

        result = result.slice(-30).reverse();
        const recentChats = result.reverse().join("\n");
        return recentChats;
    }
    
    public async seedChatHistory(seedContent: String, delimiter: string = "\n", characterKey: CharacterKey) {
        const key = this.generatedRedisCharacterKey(characterKey);

        if(await this.history.exists(key)){
            console.log("User already has chat history");
            return;
        }

        const content = seedContent.split(delimiter);
        let counter = 0;
        for(const line of content){
            await this.history.zadd(key, { score: counter, member: line });
            counter +=1 ;
        }
    }


}
