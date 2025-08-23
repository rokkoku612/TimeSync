#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ID="schedule-available-1755885477"

echo -e "${GREEN}=== Google OAuth Setup Script ===${NC}"
echo ""

# Check if project is set
echo -e "${YELLOW}Setting project to: ${PROJECT_ID}${NC}"
gcloud config set project ${PROJECT_ID}

# Enable necessary APIs
echo -e "${YELLOW}Enabling necessary APIs...${NC}"
gcloud services enable calendar-json.googleapis.com
gcloud services enable iamcredentials.googleapis.com

echo ""
echo -e "${GREEN}✅ APIs enabled successfully!${NC}"
echo ""

# Generate OAuth consent screen configuration
echo -e "${YELLOW}Creating OAuth consent screen configuration...${NC}"

# Note: OAuth 2.0 Client creation requires manual setup or using API directly
echo -e "${RED}⚠️  IMPORTANT: OAuth 2.0 Client ID creation requires manual steps${NC}"
echo ""
echo -e "${GREEN}Please follow these steps to complete the setup:${NC}"
echo ""
echo "1. Open the following URL in your browser:"
echo -e "${YELLOW}   https://console.cloud.google.com/apis/credentials/oauthclient?project=${PROJECT_ID}${NC}"
echo ""
echo "2. If prompted to configure OAuth consent screen first:"
echo "   - User Type: External"
echo "   - App name: TimeSync"
echo "   - User support email: Your email"
echo "   - Developer contact: Your email"
echo "   - Click 'Save and Continue'"
echo "   - Scopes: Add 'Google Calendar API' scope"
echo "   - Test users: Add your email"
echo "   - Save and Continue"
echo ""
echo "3. Create OAuth 2.0 Client ID:"
echo "   - Application type: Web application"
echo "   - Name: TimeSync Local"
echo "   - Authorized JavaScript origins:"
echo -e "${YELLOW}     http://localhost:5173${NC}"
echo "   - Authorized redirect URIs:"
echo -e "${YELLOW}     http://localhost:5173${NC}"
echo "   - Click 'Create'"
echo ""
echo "4. Copy the Client ID (format: xxxxx.apps.googleusercontent.com)"
echo ""
echo -e "${GREEN}5. Update .env file with your Client ID:${NC}"
echo "   Open .env file and replace YOUR_ACTUAL_CLIENT_ID_HERE with the copied ID"
echo ""
echo -e "${YELLOW}Press Enter to open the Google Cloud Console in your browser...${NC}"
read

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "https://console.cloud.google.com/apis/credentials/oauthclient?project=${PROJECT_ID}"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "https://console.cloud.google.com/apis/credentials/oauthclient?project=${PROJECT_ID}"
fi

echo ""
echo -e "${GREEN}After completing the manual steps, paste your Client ID here:${NC}"
read CLIENT_ID

if [ ! -z "$CLIENT_ID" ]; then
    # Update .env file
    sed -i.bak "s/YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com/${CLIENT_ID}/" .env
    echo -e "${GREEN}✅ .env file updated with Client ID!${NC}"
    echo ""
    echo -e "${GREEN}Setup complete! The development server will automatically reload.${NC}"
else
    echo -e "${YELLOW}No Client ID provided. Please update .env manually.${NC}"
fi