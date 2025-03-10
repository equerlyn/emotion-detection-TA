Build the Docker image: Open your terminal, navigate to the directory containing your Dockerfile, and run the following command:
  - docker build -t my-fastapi-app .
Replace my-fastapi-app with your desired image name.

Run the Docker container: After the image is built, you can run the container with the following command:
  - docker run -d -p 8000:8000 my-fastapi-app
This command runs the container in detached mode (-d) and maps port 8000 of the container to port 8000 on your host machine.

Access the application: You can access your FastAPI application by navigating to http://localhost:8000 in your web browser.

---

Best Practices for Creating Efficient Docker Images
Use a .dockerignore file: Similar to .gitignore, this file can be used to exclude files and directories from being copied into the Docker image, which can help reduce the image size. Common entries include __pycache__, .git, and *.pyc.

Minimize layers: Combine commands where possible to reduce the number of layers in the image. For example, you can combine the COPY commands.

Use specific versions: Specify exact versions of dependencies in your requirements.txt to ensure consistent builds.

Clean up after installation: If you install any packages that are not needed at runtime, consider removing them in the same layer to keep the image size small.