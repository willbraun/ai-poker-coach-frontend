# Overview

Poker is a game of incomplete information and luck, so it can be difficult to know if your play is correct. With this app, you can analyze your poker hands using AI fine-tuned with poker information to get advice. You can review your analysis in English rather than deciphering complex diagrams via traditional methods of poker study.

## Features

- Analyze your poker hands with an OpenAI Assistant powered up with poker knowledge
- Learn from other players' hands in a social media-style feed. Usernames are hidden so that your playing style isn't revealed 😎
- Responsive design for mobile and desktop

## Tech Stack

**Client (this repository):** Next.js, React, TypeScript, ShadCN UI, TailwindCSS, Netlify

**Server ([see here](https://github.com/willbraun/ai-poker-coach)):** ASP.NET Core Web API, C#, Entity Framework Core, PostgreSQL, Digital Ocean, Linux, nginx

**3rd-Party APIs**: OpenAI Threads API to interact with OpenAI Assistant powered by `gpt-3.5-turbo` with added poker documents.
