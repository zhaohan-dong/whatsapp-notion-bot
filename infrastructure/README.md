# MSII SDG Infrastructure

Infrastructure for the MSII SDG project.


## Components
### Terraform
AWS infrastructure is managed using Terraform. The Terraform configuration is located in the `terraform` directory.

### tfvars
Expect the following in `terraform.tfvars`
```
region               =  # aws region
aws_account_id       =  # aws account
notion_database_id   =  # From notion webpage url
public_subnet_cidrs  = 
private_subnet_cidrs = 
availability_zones   = 
jwt_secret_key       = 
notion_api_key 
```

### ec2_docker_compose
Because whatsapp-bot can only be authenticated at a fixed IP address, we decide to run all of our containers on a ec2 instance instead of using ASG.

Install docker compose:

``` {bash}
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

### WhatsApp Bot Authentication
AWS CloudWatch cannot display the QR code required to authenticate WhatsApp Bot. So the authentication procedure is as follows:
- Run the WhatsApp Bot locally and authenticate the WhatsApp session
Read more in the WhatsApp Messenger README.md.
