**OpenBPM Tasklist** is a template of a React application that implements basic functionality for working with end-user
tasks.

**Key Features**

- **Task Browsing:** Navigate through the active tasks assigned to the logged-in user.
- **Task Completion:** Complete a task using task forms.
- **Process Browsing:** Navigate through the active processes that can be started from the Tasklist.
- **Process Start:** Start new instances of the processes using start forms.

> [!NOTE]
> OpenBPM Tasklist does not provide the backend implementation, but it can work with BPM engine REST API out-of-box.
> Camunda 7 and Operaton engines are supported.

OpenBPM Tasklist is built using the following libraries and frameworks:

- [React](https://react.dev/)
- [Ant Design](https://ant.design/)
- [react-query](https://tanstack.com/query/latest)
- [form-js](https://bpmn.io/toolkit/form-js/)
- [Vite](http://vite.dev/)

## Table of Contents

- [Configuration](#configuration)
    - [Connecting to the BPM Engine](#connecting-to-the-bpm-engine)
        - [Configuring Users](#configuring-users)
    - [Custom Forms Support](#custom-forms-support)
        - [Creating Custom Forms](#creating-custom-forms)
            - [Creating a Start Form](#creating-a-start-form)
            - [Creating a User Task Form](#creating-a-user-task-form)
        - [Registering Custom Forms](#registering-custom-forms)
- [Running the Application](#running-the-application)
    - [Docker Image](#docker-image)
    - [Using Sources](#using-sources)
- [Usage](#usage)
    - [Working with Processes](#working-with-processes)
        - [Starting a Process](#starting-a-process)
    - [Working with User Tasks](#working-with-user-tasks)
        - [Completing a User Task](#completing-a-user-task)
- [Customizing the Theme](#customizing-the-theme)
- [License](#license)

## Configuration <a name="configuration"></a>

Before run the OpenBPM Tasklist, it is required to configure the following options:

1. **User interface locale (optional)**: it is not supported to switch locale in the application UI in out-of-box
   implementation. But it is possible to configure it using the `VITE_APP_LOCALE` environment variable. Supported
   values: `en, de, es, ru`.
   Default value: `en`.
2. **BPM engine connection**: by default, OpenBPM Tasklist provides an implementation for using BPM engine (Camunda 7,
   Operaton) REST API as a backend to work with processes and user tasks.

> [!TIP]
> To declare the values for the environment variables, you can create the `env.local` file and copy the content from
`env.example` to the created file.
> In case of local usage, you can also use the `.env` file.

### Connecting to the BPM engine <a name="connecting-to-the-bpm-engine"></a>

Use the following environment variables to configure a connection to the BPM engine:

1. `BPM_ENGINE_API_URL` - contains a full base URL to the BPM engine REST API, e.g. `http://localhost:8080/engine-rest`.
   Default value: http://localhost:8080/engine-rest.
2. `BPM_ENGINE_TYPE` - contains a type of BPM engine. Supported values: `CAMUNDA_7`, `OPERATON`. Default value:
   `CAMUNDA_7`

#### Configuring Users <a name="configuring-users"></a>

The `Basic` authentication is supported for Camunda 7 and Operaton engines. It means that the users that can log in
OpenBPM Tasklist should be configured on the engine application side.

For example, in case of Camunda 7 you can use the users stored in the engine database.

To add a new user using WebApps:

1. Open the BPM engine WebApps in the browser
2. Log in with the admin user
3. Click the **Admin** on the opened Welcome page
4. Click the **Create New User** in the **Users** card
5. Fill in the required fields
6. After saving, click the **Edit** button for the created user
7. Click the **Groups** tab and then **Add to a group** button
8. Select a group in the opened dialog. For correct work of the OpenBPM Tasklist, the following Authorizations should be
   allowed for the group:
    1. User
    2. Process Definition
    3. Process Instance
    4. Task
    5. Historic Task Instance

## Custom Forms Support <a name="custom-forms-support"></a>

OpenBPM Tasklist gives and ability to register and show custom forms for starting the process or completing the user
task.
The following steps must be followed when using custom forms:

1. For a start event or user task, the type must be **Embedded or External Task Forms** and the **Form key** must be
   configured in the BPMN diagram.
2. Creates a custom form implementation in the OpenBPM Tasklist sources
3. Register the component from the previous step as a custom form with the key from step #1.

### Creating Custom Forms <a name="creating-custom-forms"></a>

Custom form is a React functional component that accepts a special type of props and contains:

1. Components for showing and/or entering data including process variables.
2. Buttons panel with actions (starting a process, completing a user task, etc.)

For the most natural displaying, use the [Ant Design forms](https://ant.design/components/form).
All custom forms must be located in the `src` directory or a subdirectory within the `src` directory.

#### Creating a Start Form <a name="creating-a-start-form"></a>

The start form is used to start a process and should have the props with type `CustomStartFormProps`. You can create a
TypeScript type for the output process variables and specify it in the `CustomStartFormProps`, e.g.
`CustomStartFormProps<MyOutputVariables>`.

**Example**

The example provided below describes the form which has the following fields:

| Label         | Process variable name | Validation & Constraints                           |
|---------------|-----------------------|----------------------------------------------------| 
| Visit date    | visitDate             | Required, Date - next 2 weeks, time - from 9 to 20 |
| Contact name  | contactName           | Required                                           |
| Contact email | contactEmail          | Required, email                                    |

Also, this form has the following buttons:

1. `Send` - submits the form and start that process with variables and business key
2. `Close` - closes the start process dialog

```typescript jsx
// src/custom-forms/NewVisitForm.tsx
import {Button, DatePicker, Flex, Form, type FormProps, Input, Typography} from "antd";
import type {CustomStartFormProps} from "@features/custom-forms/types.ts";
import dayjs, {type Dayjs} from "dayjs";

const {Title} = Typography;

// a type with list of output process variables
export interface NewVisitVariables {
    visitDate: Dayjs; // will be automatically formatted to string
    contactName: string;
    contactEmail: string;
}

export const NewVisitForm = (props: CustomStartFormProps<NewVisitVariables>) => { //here the required type of props is used
    const {onSubmit: startProcess, submitInProgress, onCancel} = props;

    const handleSend: FormProps<NewVisitVariables>["onFinish"] = (formValues) => {
        // generate a business key for a new process instance
        const businessKey = "Visit by" + formValues.visitDate.format('DD/MM/YYYY HH:MM');

        // start a process with variables and business key
        startProcess(formValues, businessKey);
    };
    return (
        <>
            <Title level={4}>New visit</Title>
            <Form onFinish={handleSend} layout="vertical">
                <Form.Item<NewVisitVariables> label="Visit date"
                                              name="visitDate"
                                              rules={[{required: true, message: "Please input a date!"}]}>
                    <DatePicker minDate={dayjs()} showTime showSecond={false}
                                disabledHours={() => [...Array(9).keys(), 21, 22, 23]}
                                format="MM/DD/YYYY HH:mm"
                                maxDate={dayjs().add(2, "week")} minuteStep={30}/>
                </Form.Item>

                <Form.Item<NewVisitVariables>
                    label="Contact name"
                    name="contactName"
                    rules={[{required: true, message: "Please input your name!"}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<NewVisitVariables> label="Contact Email" name="contactEmail"
                                              rules={[{required: true, message: "Please input your email!"},
                                                  {type: "email", message: "The input is not valid E-mail!"}]}>
                    <Input/>
                </Form.Item>

                <Form.Item label={null}>
                    <Flex gap="small">
                        <Button type="primary" htmlType="submit" loading={submitInProgress}>
                            Send
                        </Button>
                        <Button onClick={onCancel}>
                            Close
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
        </>
    );
};

```

#### Creating a User Task Form <a name="creating-a-user-task-form"></a>

The user task form is used to complete a user task and should have the props with type `CustomTaskFormProps`. You can
create a
TypeScript type for the input and output variables and specify in the `CustomTaskFormProps`, e.g.
`CustomStartFormProps<MyInputVariables, MyOutputVariables>`.

**Example**

The example provided below describes the user task form which has the following fields:

| Label    | Process variable name | Validation & Constraints |
|----------|-----------------------|--------------------------| 
| Approved | approved              | Required                 |

Also, this form shows the following components:

1. `Complete` - the button which submits the form and completes the user task with variables
2. `Close` - the button which closes the user task details
3. `Visit date` - a read-only field that shows a formatted value of the `visitDate` input process variable
4. `Contact` - a read-only field that shows a concatenated value of the `contactName` and `contactEmail` input process
   variables

```typescript jsx
// src/custom-forms/CheckVisitForm.tsx
import type {CustomTaskFormProps} from "@features/custom-forms/types.ts";
import {Button, Descriptions, type DescriptionsProps, Flex, Form, Space, Switch, Typography} from "antd";
import dayjs from "dayjs";

export interface VisitInputVariables {
    visitDate: string;
    contactName: string;
    contactEmail: string;
}

export interface CheckResultVariables {
    approved: boolean;
}

export const CheckVisitDetailsForm = (props: CustomTaskFormProps<VisitInputVariables, CheckResultVariables>) => {
    const {onSubmit: handleComplete, submitInProgress, onCancel, inputVariables} = props;

    const items: DescriptionsProps["items"] = [
        {
            key: "date",
            label: 'Visit Date',
            children: <Typography>{dayjs(inputVariables.visitDate).format("DD/MM/YYYY HH:MM")}</Typography>,
        },
        {
            key: "contact",
            label: 'Contact',
            children: <Typography>{inputVariables.contactName} ({inputVariables.contactEmail})</Typography>,
        },
    ];
    return (
        <>
            <Space direction="vertical">
                <Descriptions items={items} column={1}/>
                <Form onFinish={handleComplete}>
                    <Form.Item<CheckResultVariables> label="Approved" name="approved">
                        <Switch/>
                    </Form.Item>
                    <Form.Item label={null}>
                        <Flex gap="small">
                            <Button type="primary" htmlType="submit" loading={submitInProgress}>
                                Complete
                            </Button>
                            <Button onClick={onCancel}>
                                Close
                            </Button>
                        </Flex>
                    </Form.Item>
                </Form>
            </Space>

        </>
    );
};

```

### Registering a Custom Form <a name="registering-a-custom-form"></a>

After creating the custom form React component, it is required to register it in the OpenBPM Tasklist. It means that it
is necessary to specify for which form key (used in the BPMN diagram) the created component should be displayed as a
start form or as a user task form in the OpenBPM Tasklist.

All used custom forms should be declared in the `src/features/custom-forms/config.ts`.

For the examples above, the following configurations can be added:

```typescript
// src/features/custom-forms/config.ts

import type {CustomFormConfig} from "./types.ts";
import {NewVisitForm} from "../../custom-forms/NewVisitForm.tsx";
import {CheckVisitDetailsForm} from "../../custom-forms/CheckVisitDetailsForm.tsx";

// Configuration for custom task and start forms used in the business process diagrams
export const customFormConfigs: CustomFormConfig[] = [
    // added configuration for a custom start form
    {
        formKey: "newVisit",
        component: NewVisitForm,
    },

    // added configuration for a custom user task form
    {
        formKey: "checkVIsitDetails",
        component: CheckVisitDetailsForm,
    }
];

```

In this case:

1. `NewVisitForm` component will be shown as a start form in the start process dialog, if the start event in the process
   has the `newVisit` form key.
2. `CheckVisitForm` component will be shown as a task form in the user task details panel, if the user task in the
   process has the `checkVisitDetails` form key.

## Running the Application <a name="running-the-application"></a>

You can run OpenBPM Tasklist using either a Docker image or from source code.

### Docker Image <a name="docker-image"></a>

This method allows running the OpenBPM Tasklist with a pre-built Docker image.

**Prerequisites:**

You must have the following installed:

1. Docker
2. Docker Compose

Instructions can be found [here](docker-compose/README.md).

### Using Sources <a name="using-sources"></a>

This method allows building and running OpenBPM Tasklist locally with `npm` and [Vite](http://vite.dev/).

**Prerequisites:**

You must have the following installed:

1. Git
2. NodeJs (version 20.19+, 22.12+)
3. npm (version 8+)

**Instructions:**

1. Clone the repository:
    ```shell
     git clone https://github.com/openbpm-platform/openbpm-tasklist-react
    ```
2. Configure a connection to the BPM engine database:
    - Create `env.local` file in the cloned project directory 
    - Add the following configuration:
   ```dotenv
      # Application locale settings. Available values: en, de, es, ru
      VITE_APP_LOCALE=en
      # BPM engine connection configuration. Available types: CAMUNDA_7, OPERATON.
      VITE_BPM_ENGINE_API_URL=http://localhost:8080/engine-rest
      VITE_BPM_ENGINE_TYPE=CAMUNDA_7
   ```
   Change the values to suit your needs.
3. Navigate to the cloned project directory and open a terminal.
4. Run the following commands:
   If it is the first time to run an application, install application dependencies.
   ```shell
    npm install
   ```
   After the command execution, then the `node_modules` directory should appear in the root directory of the project.

   Run application:
   ```shell
    npm run dev
   ```
5. After that, the running application will be available at http://localhost:3000 in the browser.

## Usage <a name="usage"></a>

OpenBPM Tasklist requires authenticated access. To add more users, see the [Configuring Users](#configuring-users)
section.

### Working with Processes <a name="working-with-processes"></a>

To view the business processes deployed on the configured BPM engine, click the **Processes** item in the application
menu.
The **Processes** page will open, enabling you to filter and sort deployed processes displayed in the table.
Only the latest versions of deployed processes are displayed.

The following actions are also available:

- **Refresh:** reloads a process list from the BPM engine.
- **Sort:** an action to sort a list of processes.
- **Start process:** an action to start a process.

#### Starting a Process <a name="starting-a-process"></a>

To start a process instance immediately, click the **Start process** button for the desired process.

Depending on what form is linked to the start event, the following content is shown in the opened dialog:

1. If no form is linked — the **Business key** field.
2. If Camunda form — the content of the deployed form.
3. If custom form — the content of a [registered custom form](#custom-forms-support).

**Note:** Embedded and generated forms are not supported in the OpenBPM Tasklist.

### Working with User Tasks <a name="working-with-user-tasks"></a>

You can view active user tasks by selecting the **Tasks** item in the application menu. The **Tasks** page
will open, enabling you to filter and sort the active tasks assigned to the current user and associated with the
configured BPM engine.

#### Completing a User Task <a name="completing-a-user-task"></a>

You can view more details about the active user task by clicking the Edit button for a task in the table on the **Tasks
** page.
After clicking, the panel with task details and linked form is opened on the right side.

Depending on what form is linked to the user task, the following content is shown in the user task details panel:

1. If no form is linked — the **Complete** button only.
2. If Camunda form — the content of the deployed form and the **Complete** button.
3. If custom form — the content of a [registered custom form](#custom-forms-support).

**Note:** Embedded and generated forms are not supported in the OpenBPM Tasklist.


## Customizing the Theme <a name="customizing-the-theme"></a>

Ant Design used in OpenBPM Tasklist provides an ability to customize the application theme.
More information about theme customization is described in [Ant Design docs](https://ant.design/docs/react/customize-theme).

To customize a Design token in OpenBPM Tasklist:
1. Open `src/features/theme/openbpmTheme.ts`
2. Change colors to the required values


## License <a name="license"></a>

OpenBPM Tasklist is an open-source project distributed under
the [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) license. 
