import initializeClient from "@arakoodev/edgechains.js/sync-rpc";
import JsonnetEngine from "@arakoodev/jsonnet";
import { ArakooServer as ResearchServer } from "@arakoodev/edgechains.js/arakooserver";
import fileURLToPath from "file-uri-to-path";
import path from "path";

// Initialize the server and Jsonnet engine
const researchServer = new ResearchServer();
const jsonnetEngine = new JsonnetEngine();
const researchApp = researchServer.createApp();

// Resolve current directory
const currentDir = fileURLToPath(import.meta.url);

// Load API keys
const secretsFilePath = path.join(currentDir, "../../jsonnet/secrets.jsonnet");
const apiKeys = JSON.parse(jsonnetEngine.evaluateFile(secretsFilePath));
const bingAPIKey = apiKeys.bing_api_key;
const openAIAPIKey = apiKeys.openai_api_key;

// Initialize workers for synchronous RPC
const openAIWorker = initializeClient(path.join(currentDir, "../lib/generateResponse.cjs"));
const bingSearchWorker = initializeClient(path.join(currentDir, "../lib/bingWebSearch.cjs"));
const webScraperWorker = initializeClient(path.join(currentDir, "../lib/scrapPageContent.cjs"));

// Define the landing page
researchApp.get("/", (context) => {
    return context.html(
        <Layout>
            <div className="flex h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-300">
                {/* Sidebar */}
                <div className="w-1/2 h-full flex flex-col border-r border-gray-700 bg-gray-850 text-gray-100">
                    <div className="p-10 h-full w-full flex flex-col items-center justify-center text-center">
                        <div className="mb-12 text-center">
                            <h2 className="text-5xl font-extrabold text-white mb-4">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
                                    Research Made Simple
                                </span>
                            </h2>
                            <p className="text-base text-gray-400 leading-relaxed">
                                Use our AI-powered bot to simplify your research tasks. Provide your query, and let us handle the rest.
                            </p>
                        </div>
                        <form
                            hx-target="#output"
                            className="space-y-6 w-full flex flex-col items-center"
                            id="queryForm"
                            hx-encoding="multipart/form-data"
                            hx-post="/research"
                            _="on submit 
                                set @disabled of #sendButton to true
                                remove .hidden from #output
                                then set @disabled of #sendButton to false
                                set #queryInput's value to ''
                                "
                        >
                            <input
                                id="queryInput"
                                name="query"
                                placeholder="Enter your query here..."
                                className="w-3/4 h-14 px-6 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300 transform hover:scale-105"
                            />
                            <button
                                className="mt-4 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50"
                                id="sendButton"
                                type="submit"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
                {/* Output Section */}
                <div className="w-1/2 flex flex-col bg-gray-900 text-white">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-3xl font-bold text-center">
                            Research Results
                        </h2>
                    </div>
                    <div
                        id="output"
                        className="flex hidden flex-col overflow-y-auto px-6 py-6 h-[44rem] space-y-6 bg-gray-950 text-sm rounded-lg shadow-inner"
                    >
                        <div className="flex justify-center items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-16 h-16 text-blue-500 animate-pulse"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="4" cy="12" r="3" fill="currentColor">
                                    <animate
                                        id="loadingDot1"
                                        attributeName="r"
                                        begin="0;loadingDot2.end-0.25s"
                                        dur="0.75s"
                                        values="3;.2;3"
                                    />
                                </circle>
                                <circle cx="12" cy="12" r="3" fill="currentColor">
                                    <animate
                                        attributeName="r"
                                        begin="loadingDot1.end-0.6s"
                                        dur="0.75s"
                                        values="3;.2;3"
                                    />
                                </circle>
                                <circle cx="20" cy="12" r="3" fill="currentColor">
                                    <animate
                                        id="loadingDot2"
                                        attributeName="r"
                                        begin="loadingDot1.end-0.45s"
                                        dur="0.75s"
                                        values="3;.2;3"
                                    />
                                </circle>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
});

// Research route handling
researchApp.post("/research", async (context) => {
    console.time("Processing Time");
    const { query } = await context.req.parseBody();
    jsonnetEngine.extString("userQuery", query);
    jsonnetEngine.extString("bingAPIKey", bingAPIKey);
    jsonnetEngine.extString("openAIAPIKey", openAIAPIKey);
    jsonnetEngine.javascriptCallback("openAIWorker", openAIWorker);
    jsonnetEngine.javascriptCallback("bingSearchWorker", bingSearchWorker);
    jsonnetEngine.javascriptCallback("webScraperWorker", webScraperWorker);
    const processedData = JSON.parse(
        jsonnetEngine.evaluateFile(path.join(currentDir, "../../jsonnet/main.jsonnet"))
    );
    const formattedResponse = processedData
        .replace(/\n/g, "<br/>")
        .replace(/\"/g, '"')
        .replace(/##\s/g, "<h2>")
        .replace(/###\s/g, "<h3>")
        .replace(/#\s/g, "<h1>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    console.timeEnd("Processing Time");
    return context.json(formattedResponse);
});

// Start the server
researchServer.listen(3000);
