# Echo: Your AI-Powered DevOps Co-pilot 🤖

Echo is a GitHub App that acts as an intelligent co-pilot for your DevOps workflows. It automatically analyzes Infrastructure as Code (IaC) within your pull requests to provide critical insights *before* you merge.

---

### The Problem: The Ephemeral Environment Paradox

Modern DevOps loves ephemeral environments, but they bring challenges:
*   **Cost Blindness:** Developers push code without knowing the financial impact of the infrastructure they're defining.
*   **Security Gaps:** Misconfigurations in IaC can easily slip through code review and into production.
*   **Best Practice Drift:** Maintaining high standards for IaC across a growing team is difficult.

### The Solution: Automated Pre-Merge Analysis

Echo tackles these problems by commenting directly on your pull requests with an AI-generated analysis covering:

*   **💰 Cost Analysis:** A high-level estimate of the cost impact of the changes.
*   **🛡️ Security Concerns:** A check for common vulnerabilities like overly permissive security groups or public S3 buckets.
*   **✨ Best Practices:** Recommendations for improving code quality, such as adding necessary tags or locking provider versions.

---

### 🚀 Getting Started

#### 1. Create a GitHub App

*   Go to **Settings** > **Developer settings** > **GitHub Apps** > **New GitHub App**.
*   **GitHub App name:** `echo-copilot-[your-username]` (e.g., `echo-copilot-octocat`)
*   **Homepage URL:** `https://github.com/mkhubaib666/echo-devops-copilot`
*   **Webhook:**
    *   **Active:** Yes
    *   **Webhook URL:** Use a service like [Smee.io](https://smee.io/) to get a temporary URL for local development. For production, this will be your server's URL.
*   **Webhook secret:** Generate a strong secret and save it.
*   **Permissions:**
    *   **Pull requests:** `Read & write` (to read diffs and post comments)
    *   **Contents:** `Read-only` (to access code)
*   **Subscribe to events:** `Pull request`
*   Create the app. On the next page, generate and download a **private key**.

#### 2. Set Up the Project

```bash
# Clone the repository
git clone https://github.com/mkhubaib666/echo-devops-copilot.git
cd echo-devops-copilot

# Install dependencies
npm install
```

#### 3. Configure Environment Variables

*   Create a file named `.env` in the project root.
*   Copy the contents of `.env.example` into it.
*   Fill in the values:
    *   `APP_ID`: From your GitHub App's settings page.
    *   `WEBHOOK_SECRET`: The secret you created earlier.
    *   `GEMINI_API_KEY`: Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   `PRIVATE_KEY`: Open the `.pem` file you downloaded, copy its entire contents, and paste it into the `.env` file, enclosed in double quotes (e.g., `PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."`).

#### 4. Run the App

```bash
# Start the app in development mode
npm run dev
```

Your app is now running locally and listening for webhooks from GitHub!

#### 5. Install the App

*   Go to your GitHub App's settings page.
*   Click "Install App" and choose the repository where you want to use Echo.
*   Now, open a pull request in that repository with changes to a `.tf` file to see Echo in action!

---

