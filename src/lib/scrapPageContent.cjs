import { AutoPlayWriteWebPageScrapper } from "@arakoodev/edgechains.js/scraper";

const scraper = new AutoPlayWriteWebPageScrapper();

async function getContent(url) {
    try {
        return await scraper.getContent(url);
    } catch (error) {
        console.log("Error Scraping: " + url);
        return " ";
    }
}

module.exports = getContent;
