# Setup

Install

* Node 9+
* Yarn

In your hosts file map `xyz-store` to `localhost`

Link your s3 bucket for public folders in FeatureImgUrl transformer

Create mongodb dbs `xyz-blog-logging` and `xyz-blog`

# Building the images

Build the docker image

    docker build -t xyz-web-img .

# Running containers

Run the db

    docker run --name xyz-store -d mongo

Run the web app

    docker run -d --name xyz-web -p 80:80 --link xyz-store xyz-web-img

# Deploying

Log in to registry

    docker login YOUR_DOCKER_REGISTRY

Build and push image to registry (from workspace)

    docker build -t YOUR_DOCKER_REGISTRY/IMAGE_NAME .
    docker push YOUR_DOCKER_REGISTRY/IMAGE_NAME

Pull and run image from registry (on deployment environment)

    docker run -d --name xyz-web -p 80:80 --link xyz-store YOUR_DOCKER_REGISTRY/IMAGE_NAME
