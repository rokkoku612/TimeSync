terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "timesync-project"
  region  = "asia-northeast1"
}

# Enable required APIs
resource "google_project_service" "calendar_api" {
  service = "calendar-json.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "iam_credentials" {
  service = "iamcredentials.googleapis.com"
  disable_on_destroy = false
}

# Note: OAuth 2.0 consent screen and client creation requires manual setup
# due to Google Cloud limitations with Terraform.
# 
# After running terraform apply, complete the OAuth setup manually:
# 1. Go to https://console.cloud.google.com/apis/credentials
# 2. Configure OAuth consent screen
# 3. Create OAuth 2.0 Client ID with:
#    - Type: Web application
#    - Authorized JavaScript origins: http://localhost:5173
#    - Authorized redirect URIs: http://localhost:5173

output "next_steps" {
  value = <<-EOT
    ✅ APIs enabled successfully!
    
    Next steps:
    1. Open: https://console.cloud.google.com/apis/credentials?project=timesync-project
    2. Configure OAuth consent screen (if not done)
    3. Create OAuth 2.0 Client ID
    4. Copy the Client ID and update .env file
  EOT
}