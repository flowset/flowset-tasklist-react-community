This repository contains links to OpenBPM Tasklist resources and supporting configuration files for running Docker
Compose as a local development option.

## Using Docker Compose

The following Docker Compose files are provided:

1. [docker-compose.yaml](docker-compose.yaml) which contains the OpenBPM Tasklist only.
   **Note:** This Docker Compose is suitable for cases when you need to connect to already running external BPM engines.

## Running using Docker Compose

1. Clone this repository
2. Configure your first connection to the Camunda 7 engine in the `.env` file.
   Set values for the `BPM_ENGINE_API_URL` and `BPM_ENGINE_TYPE` variables.
   Example for the Camunda 7 running locally on port 8082 with enabled REST API:
   ```dotenv
    BPM_ENGINE_API_URL=http://localhost:8080/engine-rest
    BPM_ENGINE_TYPE=CAMUNDA_7
   ```
   **Note:** Basic authentication should be enabled for the engine REST API and the list of users should be
   configured on the engine side.
3. Configure the language which should be used to display OpenBPM Tasklist UI (by default, English is used):
   Example, for German language:
   ```dotenv
    OPENBPM_TASKLIST_LOCALE=de
   ```
4. Go to the `docker-compose` directory:
   ```shell 
   cd docker-compose
   ```
5. Execute the following commands:
   Run **OpenBPM Tasklist** using the following command:
   ```shell
     docker compose up -d
   ```
   To check container status:
   ```shell
     docker container ls -f "name=openbpm-tasklist-react"
   ```
6. Open OpenBPM Tasklist in your browser using the link [http://localhost](http://localhost).

Now you can deploy processes to the configured BPM engine and manage process instances running on this engine.

## Additional configuration

You can explore the environment variables used by services in the `.env` file and change them to run locally if
necessary.