import Configuration from "openai";
import OpenAIApi from "openai";
import dotenv from "dotenv";
import express, { response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();

const configuration = new Configuration({
    // organization: "org-8Pk1U1HkXMeXWqxaOCjIObsn",
    apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration as any);

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.post("/message", async (req, res) => {
    try {
        const message = req.body.message;

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders(); // 설정한 헤더를 클라이언트에게 보냄

        const stream = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: message }],
            stream: true,
        });

        let completeMessage = "";
        for await (const part of stream) {
            const content = part.choices[0]?.delta?.content || "";
            completeMessage += content;

            // 서버 콘솔에 출력
            process.stdout.write(content);

            // 클라이언트에게 연속적으로 데이터 전송
            res.write(`data: ${content}\n\n`);
        }

        process.stdout.write("\n");
        res.end(); // 응답 종료
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

// if(response.choices[0].message.content){
//   res.send(response.choices[0].message.content)
// }

// const chat = 'SELECT * FROM chat';

// connection.query(chat, function (error: Error, userResults: string) {
//   if (error) throw error;
// });

app.listen(process.env.PORT, () => {
    console.log("server running..");
});
