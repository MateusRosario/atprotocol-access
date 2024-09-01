import { AtpAgent, AtpSessionEvent, AtpSessionData } from '@atproto/api'
import dotenv from 'dotenv';

dotenv.config();

let session;
let sessionEvent;

async function main() {
    console.log("Start");
    try {
        // configure connection to the server, without account authentication
        const agent = new AtpAgent({
            service: 'https://bsky.social',
            persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
                sessionEvent = evt;
                session = sess;
            },
        });

        //console.log("Agent:", agent);
        
        const login = await agent.login({
            identifier: process.env.BSKY_USER as string,
            password: process.env.BSKY_APP_PASSWORD as string,
        });

        //console.log("Login", login);

        console.log("Waiting posts ...");
        // const posts = await agent.getTimeline();

        // posts.data.feed.forEach(feedItem => {
        //     console.log("Post: ", feedItem.post.author.displayName, feedItem.post.embed);
        // })

        const notfs = await agent.getTimeline();

        notfs.data.feed.forEach(item => {
            const content = item.post;
            console.log('===================================================');
            console.log(content.author.displayName)
            const record: any = content.record;
            console.log(Object.keys(content.record));

            if('$type' in content.record) {
                console.log('type:', record['$type']);
            }

            if('createdAt' in content.record) {
                console.log(record.createdAt);
            }
            
            if('text' in content.record) {
                console.log(record.text);
            }
            console.log('===================================================');
        })

        // const actors = await agent.searchActors({q: ''});
        // actors.data.actors.forEach(actor => {
        //     console.log(actor.description);
        // })
    } catch(ex) {
        console.log("Error", ex);
    }
}

main();