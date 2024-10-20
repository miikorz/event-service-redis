# Event Service

## Overview

The Event Service is a Node.js application designed to integrate events from an external provider into our marketplace. It fetches events in XML format, normalizes and stores them in Redis for quick access, and exposes a RESTful API to query events within a specified time range.

## Features

- **Technology Stack**:

  - Node.js (Latest LTS)
  - TypeScript
  - Express.js
  - Redis
  - Jest for testing
  - Docker for containerization
  - OpenAPI Specification for API documentation

- **Domain-Driven Design**: Focuses on the `Event` entity.

- **Performance**: Optimized to respond within hundreds of milliseconds by leveraging Redis caching.

- **Resilience**: The API remains responsive even if the external provider is down.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS version)
- [Docker](https://www.docker.com/)
- [Make](https://www.gnu.org/software/make/)

### Running the Application through docker (using Make)

1. **Build and run the containers**:

   ```bash
    make run
   ```

   This command builds the Docker image, installs all the needed dependencies and starts both the application and Redis services.

2. **Access the API**:

   The API will be available at http://localhost:3000/events

3. **Access the API documentation (openApi Spec) to know how to endpoint works:**

   The documentation is available at http://localhost:3000/docs

### Testing

**Run tests using Jest:**

    make test

###### OR

    npm run test

### API Documentation

The API follows the OpenAPI specification. You can find the openapi.yaml file in the src/api directory. Tools like Swagger UI can be used to visualize and interact with the API documentation.

### Design Decisions

- **Redis for Caching**: Chosen for its speed to ensure the API responds quickly, even under high load or when the external provider is slow or unavailable.

- **Domain-Driven Design**: The application is designed around the `Event` entity, which simplifies the codebase and makes it easier to maintain and extend.

- **OpenAPI Specification**: Ensures that the API is well-documented and follows a standard contract, facilitating easier integration and maintenance.

- **Dockerization**: The application is containerized to ensure consistency across different environments and simplify deployment.

- **Error Handling**: The application is designed to handle failures gracefully, ensuring that the API remains responsive even if the external provider fails.

### Future improvements focusing on performance (Challenge extra mile)

- **Optimizing Redis caching**:

  - Increase Redis Efficiency: Ensure you are using Redis data structures efficiently. For instance, storing events in a SET or ZSET (sorted set) rather than JSON blobs can improve lookup performance, especially for filtering events by date range.

  - Shard Redis for High Load: If the load on Redis grows, consider using Redis clustering to distribute data across multiple nodes. This would allow Redis to scale horizontally as the number of events grows.

  - Tune Redis Persistence: Depending on the use case, you might not need Redis persistence (RDB or AOF). If Redis data is entirely ephemeral, disabling persistence can improve write performance.

  - Set Proper Expiry Times: For frequently changing data, ensure that Redis expiration times are set appropriately to balance data freshness and reduce cache misses

- **Scheduled Data Fetch**: Use a scheduled background job to fetch and update events regularly in Redis (e.g., every minute) instead of fetching them on demand. This minimizes hitting the external provider and ensures data is mostly fresh.

- **Enhanced Error Handling**: More granular error handling and retry mechanisms for external API calls.

- **Monitoring and Logging**: Integrate monitoring tools and structured logging for better observability.

- **Horizontal Scaling**:
  - Scale Out with Node.js Clusters: Use the Node.js Cluster module to fully utilize multiple CPU cores. This will help handle thousands of concurrent requests by spawning multiple instances of your application, one per CPU core.

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Your app code here
}
```

- **Container Orchestration**: Use Kubernetes or Docker Swarm to deploy your service with auto-scaling. Ensure horizontal scalability of both your application and Redis instances. Auto-scale based on CPU and memory usage or request volume.

- **API rate limiting**: Implement rate limiting using libraries like express-rate-limit to protect the service from being overwhelmed by too many requests from individual clients. This is essential to avoid DDoS attacks and keep the service available.

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // Limit each IP to 1000 requests per window
});

app.use(limiter);
```

- **Load Balancing**: Use a load balancer (e.g., NGINX or AWS ELB) in front of your service to distribute incoming traffic across multiple instances of your Node.js application. This ensures no single server is overwhelmed by traffic.

- **Efficient data parsing**: When fetching large XML data from the provider, instead of parsing the entire XML into memory, use a streaming parser like xml-stream to process large XML files incrementally. This improves memory usage and speeds up parsing.

# Fever code challenge

Hello! Glad you are on this step of the process. We would like to see how you are doing while coding and this exercise
tries to be a simplified example of something we do on our daily basis.

At Fever we work to bring experiences to people. We have a marketplace of events from different providers that are
curated and then consumed by multiple applications. We work hard to expand the range of experiences we offer to our customers.
Consequently, we are continuosly looking for new providers with great events to integrate in our platforms.
In this challenge, you will have to set up a simple integration with one of those providers to offer new events to our users.

Even if this is just a disposable test, imagine when coding that somebody will pick up this code an maintain it on
the future. It will be evolved, adding new features, adapting existent ones, or even removing unnecessary functionalities.
So this should be conceived as a long term project, not just one-off code.

## Evaluation

We will value the solution as a whole, but some points that we must special attention are:

- How the proposed solution matches the given problem.
- Code style.
- Consistency across the codebase.
- Software architecture proposed to solve the problem.
- Documentation about decisions you made.

## Tooling

- Use Python 3 unless something different has been told.
- You can use any library, framework or tool that you think are the best for the job.
- To provide your code, use the master branch of this repository.

## Description

We have an external provider that gives us some events from their company, and we want to integrate them on the Fever
marketplace, in order to do that, we are developing this microservice.

##### External provider service

The provider will have one endpoint:

https://provider.code-challenge.feverup.com/api/events

Where they will give us their list of events on XML. Every time we fetch the events,
the endpoint will give us the current events available on their side. Here we provide some examples of three different
calls to that endpoint on three different consecutive moments.

Response 1
https://gist.githubusercontent.com/sergio-nespral/82879974d30ddbdc47989c34c8b2b5ed/raw/44785ca73a62694583eb3efa0757db3c1e5292b1/response_1.xml

Response 2
https://gist.githubusercontent.com/sergio-nespral/82879974d30ddbdc47989c34c8b2b5ed/raw/44785ca73a62694583eb3efa0757db3c1e5292b1/response_2.xml

Response 3
https://gist.githubusercontent.com/sergio-nespral/82879974d30ddbdc47989c34c8b2b5ed/raw/44785ca73a62694583eb3efa0757db3c1e5292b1/response_3.xml

As you can see, the events that aren't available anymore aren't shown on their API anymore.

##### What we need to develop

Our mission is to develop and expose just one endpoint, and should respect the following Open API spec, with
the formatted and normalized data from the external provider:
https://app.swaggerhub.com/apis-docs/luis-pintado-feverup/backend-test/1.0.0

This endpoint should accept a "starts_at" and "ends_at" param, and return only the events within this time range.

- It should only return the events that were available at some point in the provider's endpoint(the sell mode was online, the rest should be ignored)
- We should be able to request this endpoint and get events from the past (events that came in previous API calls to the provider service since we have the app running) and the future.
- The endpoint should be fast in hundred of ms magnitude order, regardless of the state of other external services. For instance, if the external provider service is down, our search endpoint should still work as usual.

Example: If we deploy our application on 2021-02-01, and we request the events from 2021-02-01 to 2022-07-03, we should
see in our endpoint the events 291, 322 and 1591 with their latest known values.

## Requirements

- The service should be as resource and time efficient as possible.
- The Open API specification should be respected.
- Use PEP8 guidelines for the formatting
- Add a README file that includes any considerations or important decision you made.
- If able, add a Makefile with a target named `run` that will do everything that is needed to run the application.

## The extra mile

With the mentioned above we can have a pretty solid application. Still we would like to know your opinion, either
directly coded (if you want to invest the time) or explained on a README file about how to scale this application
to focus on performance. The examples are small for the sake of the test, but imagine that those files contains
thousands of events with hundreds of zones each. Also consider, that this endpoint developed by us, will have peaks
of traffic between 5k/10k request per second.

## Feedback

If you have any questions about the test you can contact us, we will try to reply as soon as possible.

In Fever, we really appreciate your interest and time. We are constantly looking for ways to improve our selection processes,
our code challenges and how we evaluate them. Hence, we would like to ask you to fill the following (very short) form:

https://forms.gle/6NdDApby6p3hHsWp8

Thank you very much for participating!
