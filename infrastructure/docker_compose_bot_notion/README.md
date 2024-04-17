#  Docker Compose for WhatsApp and Notion

## Environment Variables
Pass in environment variables
- whatsapp-bot
  ```
  PORT # port to open
  WHATSAPP_CLIENT_ID # whatsapp gives each client an ID, we can use messenger1 here
  WHATSAPP_AUTH_DATA_PATH=/app/.whatsapp_auth
  JWT_SECRET_KEY=
  JWT_USERNAME=
  JWT_PASSWORD=
  ```
- Notion
  ```angular2html
  NOTION_API_KEY= #obtain from notion
  NOTION_DATABASE_ID= # in the url of notion database
  WHATSAPP_NUMBER= # Format should be <number>@g.us for group, or <number>@c.us for
  WHATSAPP_SERVICE_IP=
  WHATSAPP_SERVICE_PORT=
  WHATSAPP_JWT_USERNAME=  # Match whatsappbot's
  WHATSAPP_JWT_PASSWORD=  # Match whatsappbot's

  ```