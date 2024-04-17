# Create ECR repositories for each container service

module "whatsapp_bot_image_repository" {
  source = "../../image_repository"
  name   = "whatsapp-bot"
}

module "notion_integration_image_repository" {
  source = "../../image_repository"
  name   = "notion-integration"
}