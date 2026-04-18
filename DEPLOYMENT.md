# Hugging Face Deployment Guide

This guide explains how to deploy Product Pilot to Hugging Face Spaces.

## Prerequisites

1. **Hugging Face Account**: Create an account at [huggingface.co](https://huggingface.co)
2. **GitHub Repository**: Ensure your code is in a GitHub repository
3. **API Keys**: Have ready your OpenAI, Neon, and Pinecone API keys

## Step 1: Create Hugging Face Space

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click "Create new Space"
3. Choose "Docker" as the SDK
4. Name your space (e.g., `product-pilot`)
5. Make it Public or Private based on your preference
6. Click "Create Space"

## Step 2: Configure GitHub Secrets

Add the following secret to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Add the following secret:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `HF_TOKEN` | Hugging Face access token | Go to Hugging Face Settings > Access Tokens |

### Getting HF_TOKEN

1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Select "Write" permissions
4. Copy the token
5. Add it as `HF_TOKEN` in GitHub secrets

**Note:** The GitHub Actions workflow is pre-configured for your Space (ashishsankhua/product-pilot), so you only need to add the HF_TOKEN secret.

## Step 3: Configure Environment Variables in Hugging Face

Add the following environment variables to your Hugging Face Space:

1. Go to your Space settings
2. Navigate to **Variables and Secrets**
3. Add the following variables:

| Variable Name | Description |
|---------------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `NEON_DATABASE_URL` | Your Neon PostgreSQL database URL |
| `PINECONE_API_KEY` | Your Pinecone API key |
| `PINECONE_ENVIRONMENT` | Your Pinecone environment (e.g., "us-east-1-aws") |
| `PINECONE_INDEX` | Your Pinecone index name |

## Step 4: Push to GitHub

The GitHub Actions workflow will automatically sync your code to Hugging Face when you push to the `main` branch.

```bash
git add .
git commit -m "Prepare for Hugging Face deployment"
git push origin main
```

Your repository is: https://github.com/asankhua/product-pilot

## Step 5: Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. Watch the "Sync to Hugging Face" workflow
3. Once complete, check your Hugging Face Space for the deployed application

## Step 6: Access Your Application

Your application will be available at:
```
https://huggingface.co/spaces/ashishsankhua/product-pilot
```

## Troubleshooting

### Build Fails

- Check the Dockerfile is in the root of your repository
- Ensure all dependencies are in package.json
- Check the build logs in Hugging Face Space

### Environment Variables Not Working

- Ensure variables are set in Space settings, not in .env file
- Variable names must match exactly (case-sensitive)
- Restart the Space after adding variables

### Database Connection Issues

- Verify NEON_DATABASE_URL is correct
- Ensure your Neon database allows connections from Hugging Face IPs
- Check database is not paused in Neon console

### Pinecone Connection Issues

- Verify PINECONE_API_KEY is correct
- Check PINECONE_ENVIRONMENT matches your Pinecone setup
- Ensure PINECONE_INDEX name is correct

## Manual Deployment

If the GitHub Actions workflow fails, you can manually deploy:

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Add Hugging Face remote
git remote add huggingface https://YOUR_USERNAME:HF_TOKEN@huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME.git

# Copy Hugging Face README
cp README_HF.md README.md

# Commit and push
git add README.md
git commit -m "Update README for Hugging Face"
git push huggingface main
```

## Support

For issues specific to Hugging Face Spaces, visit:
- [Hugging Face Spaces Documentation](https://huggingface.co/docs/spaces)
- [Hugging Face Community Forum](https://discuss.huggingface.co)
