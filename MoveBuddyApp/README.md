# MoveBuddy

MoveBuddy is a mobile app that makes the first step toward movement easier: start a route, keep a simple record of progress and connect with other people who want to move. It is an early Social Impact Award project built around a simple belief — community makes healthy habits more accessible and sustainable.

## What the demo includes

The Expo app supports secure registration and login, starts a GPS route with a live map and distance counter, saves completed activity to the MoveBuddy backend, shows a personal activity history, and lists registered community members so a signed-in user can send an invitation to move together.

The experience is intentionally simple and Croatian-language first: **Početna**, **Suputnici** and **Povijest** make the video flow easy to follow.

## Run it in Expo

Use Node.js 20.19 or newer. From the app directory:

```bash
npm install
npx expo install --fix
npx expo start
```

Scan the QR code with Expo Go on Android or open an iOS development build. GPS route tracking needs a real phone with Location Services enabled; it will not give a meaningful route in a browser or simulator.

By default the app calls `https://movebuddy-db.onrender.com`. To use another deployed or local backend, create a `.env` file:

```env
EXPO_PUBLIC_API_URL=https://your-service.onrender.com
```

Do not add production credentials to the repository. The backend URL is public configuration, while the sign-in token is stored on-device using Expo SecureStore.

## Backend contract

MoveBuddy calls `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/activities`, `GET /api/activities/user/{userId}`, `GET /api/users` and `POST /api/invitations/send`.

The companion backend repository and deployment notes are in [MoveBuddy](https://github.com/romansimunovic/MoveBuddy).

## Social impact

Many people find it hardest to begin — and to stay consistent — when they exercise alone. Inspired by the welcoming idea of an Erasmus buddy, MoveBuddy brings that everyday support to walking, running and cycling. It is designed to make movement feel less isolating, more social and easier to repeat.

## GenAI transparency

MoveBuddy was conceived, directed and reviewed by its author. During development, GenAI was used as a practical support tool for code organisation, technical troubleshooting, interface copy and README editing. The work used ChatGPT/Codex with the **GPT-5.6 Terra** model, which OpenAI describes as a GPT-5.6 model designed to balance intelligence and cost. The final product decisions, Social Impact Award narrative and responsibility for review remain with the project author. [OpenAI model documentation](https://developers.openai.com/api/docs/models/gpt-5.6-terra)

## License

MIT. See [LICENSE](./LICENSE).
