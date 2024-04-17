output "ecs_repository_urls" {
  value = {
    whatsapp-bot       = module.whatsapp_bot_image_repository.repository_url
    notion-integration = module.notion_integration_image_repository.repository_url
  }
}