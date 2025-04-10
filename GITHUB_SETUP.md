# Setting Up Your Template on GitHub

Follow these steps to make this template available via `npx degit`:

> **Note**: This file and `.gitignore-degit` will NOT be included when users download your template via degit because they're listed in the `.gitignore-degit` file. This file is only for your reference as the template creator.

## 1. Create a GitHub Repository

1. Go to https://github.com/new
2. Name your repository: `codingAssistantFramework`
3. Make it public
4. Do not initialize it with a README (we already have one)
5. Click "Create repository"

## 2. Initialize Git and Push to GitHub

Run these commands in the root directory of this template:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit of AI Coding TDD Framework"

# Add your GitHub repository as remote
git remote add origin https://github.com/jejanov/codingAssistantFramework.git

# Push to GitHub
git push -u origin main
```

## 3. Test the Installation

After pushing to GitHub, test the template installation:

```bash
# Create a test directory
mkdir test-template
cd test-template

# Download the template using degit
npx degit jejanov/codingAssistantFramework

# Check if files were correctly downloaded
ls -la
```

## 4. Share with Others

Users can now install your template with:

```bash
npx degit jejanov/codingAssistantFramework
```

## 5. Updating the Template

To update the template:

1. Make your changes locally
2. Commit and push to GitHub
3. Users will get the latest version when they run the degit command