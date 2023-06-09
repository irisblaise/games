import fetch from "cross-fetch";
import React, { useState, ChangeEvent, FormEvent } from 'react';

const axios = require("axios");

type FormData = {
    hero: string;
    villain: string;
    subject1: string;
    subject2: string;
}

const StripBookInputForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        hero: '',
        villain: '',
        subject1: '',
        subject2: '',
    });

    // const [balloonTexts, setBalloonTexts] = useState<Array<string>>([]);
    // const [images, setImages] = useState<Array<string>>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const gptRequest = async (formData: FormData) => {
        const response = await axios.post(
            "https://mediamonks-eus.openai.azure.com//openai/deployments/gpt-4/chat/completions?api-version=2023-03-15-preview",
            {
                messages: [
                    {
                        role: "system",
                        content: "You are a comic book writer. Answer as if you are a REST API, only in plain JSON, no text, markdown formatting or linebreaks. The structure of the output is always a unformatted JSON string that contains an array of objects, max 2, each with 2 fields, 'description' is the descriptive text of each panel matching the image. 'textBalloon' is a text which describes the story matching the current panel."
                    },
                    {
                        role: "user",
                        content: `Could you write a story about the following: ${JSON.stringify(formData)}`
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.REACT_APP_CHAT_GPT_API_KEY,
                },
            }
        );
  return response.data.choices[0].message.content;
    };

    async function getPrediction(modelName: any, input: any) {
        return fetch("http://localhost:3001/api/replicate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({modelName, input}),
        });
    }


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const response = await gptRequest(formData);

        const JsonResponse = JSON.parse(response)

        const promises = JsonResponse.map( async (res: any) => {
           return getPrediction('ebcc7e582fbb09930e34d9bc2ab552d37411ee982585257c0a7c5fcdc05029c2', res.description)
        })

        const results = await Promise.all(promises);

        const parsedResults = results.map((result: any) => {
            return JSON.parse(result)
        })

        console.log({parsedResults})

        // setBalloonTexts()
        // setImages()
    };

    return (
        <>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px'}}>
            <label>
                The hero's name:
                <input type="text" name="hero" value={formData.hero} onChange={handleChange} />
            </label>
            <label>
                The villains name:
                <input type="text" name="villain" value={formData.villain} onChange={handleChange} />
            </label>
            <label>
                Subject 1:
                <input type="text" name="subject1" value={formData.subject1} onChange={handleChange} />
            </label>
            <label>
                Subject 2:
                <input type="text" name="subject2" value={formData.subject2} onChange={handleChange} />
            </label>
            <button type="submit">Submit</button>
        </form>

        {/*<div>*/}
        {/*    {balloonTexts && balloonTexts.map(text => <p>{text}</p>)}*/}
        {/*    {images && images.map(image => <img src={image} />)}*/}
        {/*</div>*/}
    </>
    );
};

export default StripBookInputForm;