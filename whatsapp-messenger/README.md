# WhatsApp Bot

## Running the App
AWS ECS EC2 instance is used to run the app. However, AWS CloudWatch cannot display the QR code required for WhatsApp authentication.
Therefore, the app needs to be run locally first to authenticate the WhatsApp session, then the folder within `./whatsapp-auth` needs to be copied to the EFS volume at `/`.

For example, if the EFS volume is mounted at `/mnt/efs`, and the folder `session-messenger1` is within `.whatsapp_auth`, then the `.whatsapp_auth/session-messenger1` needs to be copied to `/mnt/efs/session-messenger-1`.

### API Endpoints
The app exposes the following endpoints:
- `POST /login`: Authenticate via JWT Token
  - Returns `{"status":"Login successful", "jwtToken": "token"}`
- `GET /getChatIdByName`: Get chat ID by name
  - Returns `{"status":"success", "chatId": "chatId"}`
- `POST /api/sendMessage`: Send a message to a WhatsApp number (chat ID)
  - Returns `{"status":"Message sent", whatsappResponse}`

The other service needs to authenticate first using `POST /login` endpoint. The JWT token is then used to authenticate the other endpoints.

### WhatsApp Authentication
The authentication is done using [whatsapp-web.js localAuth](https://docs.wwebjs.dev/LocalAuth.html).
The first time running the app, it will prompt you to scan the QR code using your WhatsApp account.

## Additional Info
### Image File Structure & Attached Volumes
Image would be running under `/app` directory, with compiled files copied from ./dist folder.
The image would be running `node /app/index.js` as the entrypoint.
The whatsapp authentication session volume should be attached to `/app/.whatsapp_auth` directory, if using default `WHATSAPP_AUTH_DATA_PATH` environment variable.

### Environment Variables
`PORT`: Port to run the app on, defaults to 3000<br />
`WHATSAPP_CLIENT_ID`: WhatsApp client ID, defaults to `"messenger1"`<br />
`WHATSAPP_AUTH_DATA_PATH`: Path to the whatsapp authentication session data folder, defaults to `"./.whatsapp_auth/"`<br />
`JWT_SECRET_KEY`: Key to authenticate JWT tokens<br />
`JWT_USERNAME`: Allowed Username to authenticate JWT tokens<br />
`JWT_PASSWORD`: Allowed Password to authenticate JWT tokens<br />