# codbex-companies
Companies Management Module

### Model

<img width="534" alt="image" src="https://github.com/user-attachments/assets/2662bfd4-9df4-4b07-a641-c62f4274bb1f" />

### Application

#### Launchpad

<img width="1414" alt="Screenshot 2024-09-09 at 9 36 49" src="https://github.com/user-attachments/assets/56c646da-80f9-4468-aacb-866f23cdf8f4">

#### Management

<img width="1418" alt="Screenshot 2024-09-09 at 9 38 01" src="https://github.com/user-attachments/assets/0ba2965b-78b9-4844-93e7-8fabce53c835">

## Local Development with Docker

When running this project inside the codbex Atlas Docker image, you must provide authentication for installing dependencies from GitHub Packages.
1. Create a GitHub Personal Access Token (PAT) with `read:packages` scope.
2. Pass `NPM_TOKEN` to the Docker container:

    ```
    docker run \
    -e NPM_TOKEN=<your_github_token> \
    --rm -p 80:80 \
    ghcr.io/codbex/codbex-atlas:latest
    ```

⚠️ **Notes**
- The `NPM_TOKEN` must be available at container runtime.
- This is required even for public packages hosted on GitHub Packages.
- Never bake the token into the Docker image or commit it to source control.
