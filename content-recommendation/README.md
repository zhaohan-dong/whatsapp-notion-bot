# WhatsApp Content Push

A WhatsApp API integration to let admin automatically push contents to participants through WhatsApp message.

# Notion API Integration
Integration with Notion relies on the official [Notion SDK for Javascript](https://github.com/makenotion/notion-sdk-js). <br />
- `src/utils/notionDB.ts` contains the class and functions to perform CRUD operations on Notion database, except deletion as it is not supported through the API. <br />
- `src/utils/notionDB.d.ts` contains the types of the Notion database. It allows five fields and shall be modified according to Notion database structure the user uses.
  - Tags (multi-select)
  - Resource (name of the resource shared)
  - URL (URL of the resource shared)
  - Publish Date (date to publish the content)
  - Published (checkbox)<br />

The API documentation can be found [here](https://developers.notion.com/reference/intro).

## Deployment
### Environment Variables
`NOTION_API_KEY`: API key obtained from Notion <br />
`NOTION_DATABASE_ID`: ID of the Notion database <br />
`WHATSAPP_NUMBER`: WhatsApp ID to send the message to, ending in "@g.us" for group <br />
`WHATSAPP_SERVICE_IP`: IP address of the WhatsApp bot API endpoint<br />
`WHATSAPP_SERVICE_PORT`: Port of the WhatsApp bot API endpoint, default 3000<br />
`WHATSAPP_JWT_USERNAME`: Username for JWT authentication<br />
`WHATSAPP_JWT_PASSWORD`: Password for JWT authentication<br />
`RESOURCE_TAGS`: Tags to filter the resources to be pushed, separated by comma<br />
`HEALTHCHECK_PORT`: Port for healthcheck endpoint, default 3000<br />

### WhatsApp API Integration
Currently, integration with WhatsApp relies on web integration with an [Unofficial WhatsApp API](https://github.com/pedroslopez/whatsapp-web.js). <br />
An official WhatsApp API could be used, but it does not support messaging to a group chat. <br />
The API documentation can be found [here](https://wwebjs.dev).
