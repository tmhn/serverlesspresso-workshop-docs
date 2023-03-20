---
title: Business metrics with SQS and DynamoDB
description: Business metrics with SQS and DynamoDB
---

## Overview
- This section demonstrates the extensibility of event driven architectures. New functional requirements come up all the time in production applications. We can address new requirements for an event driven application by creating new rules for events in the Event Bus. These rules can add new functionality to the application without having any impact to the existing application stack.   
- This section shows how to route all order completed events from the OrderManager workflow to an SQS queue. A Lambda function will process the events in batches off of the queue and update the metrics table. The new rule enables business metric collection for events in your event bus.
- Using SQS as a target for EventBridge events reduces pressure on your downstream systems from spikes in traffic in the event bus.

- ![Workflow Architecture](/advanced-metrics-sqs-dynamodb-1.png)

## Track Order Metrics
- Let’s say the investors of Serverlesspresso want to understand more details about how many drinks are sold each day. While we could use the orders table to provide some metrics, it’s not so easy to write queries with the existing schema. Instead, we can create a new rule in the Event Bus and a new microservice to provide aggregate metrics for the investors.
- During the order workflow, the `WaitingCompletion` Lambda function emits an `OrderManager.WaitingCompletion` event to the Event Bus as the barista makes the order. We can use the `OrderManager.WaitingCompletion` event to update `serverlesspresso-metrics-table`.
- Serverlesspresso’s impact can be measured by collecting metrics such as orders per item type and daily order totals. With the flexibility of EventBridge rule configurations, you could even extend metrics collection to capture `OrderManager.OrderCancelled` events to track how many orders are completed or cancelled over time.
- In this module we’ll set up a new EventBridge Rule to capture all `OrderManager.WaitingCompletion` events and route them to an SQS Queue. The events are processed in batches off the queue by a Lambda function that updates metrics into a DynamoDB table.

### 1. Launch the AWS CloudFormation template

This section has its own CloudFormation template that is separate from the core stack. You'll need to follow the steps below to deploy the resources required for this module.

{% callout title="Info" %}

By executing these templates, you are taking responsibility for the lifecycle and costs associated with provisioning them. Please follow the **tear-down instructions** to remove all resources from your AWS account once you have finished the workshop to avoid incurring unexpected costs.
{% /callout %}

We will leverage AWS CloudFormation which allows us to codify our infrastructure. Select your preferred region to which you will deploy the template. Just click the Launch link to create the stack in your account.

| Region | Launch stack |
| ------ |:------|
| **US East (N. Virginia)** us-east-1 | {% button href="https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?stackName=serverless-workshop-sqs-ddb&templateURL=https://da-public-assets.s3.amazonaws.com/workshops/coffee-workshop/sqs-module-db/template-sqs-ddb.yaml" icon="fas fa-rocket" icon-position="right" colour="#ff0000" %} Launch {% /button %} |

1. Enter a stack name (or just keep the default name)
2. **Check** the boxes in the Capabilities section
3. Click **Create stack**


## Creating the rule

### Step by Step Instructions
1. Go to the EventBridge console. From the AWS Management Console, select *Services* then select EventBridge *Application Integration*. **Make sure your region is correct**.

2. Choose **Rules**. Choose **Create rule**.
3. In Step 1 of the wizard:
- For the Name, enter *OrderMetrics-DynamoDB*.
- For *Event bus*, enter `Serverlesspresso`.
- Choose **Next**.
![Rule Configuration](/advanced-metrics-sqs-dynamodb-2.png)
1. In Step 2 of the wizard:
-  For Event source, select Other.
-  Ignore the Sample event panel.
-  In the Event pattern panel, paste the following:
```
{
    "source": ["awsserverlessda.serverlesspresso"],
    "detail-type": ["OrderManager.WaitingCompletion"]
}
```
-  Choose **Next**
5. In Step 3 of the wizard:
  - In the Target 1 panel, choose AWS service.
  - In the Select a target dropdown, choose SQS queue
  - In the Queue dropdown, choose the SQS Queue `MetricsQueue`.
  - This was deployed by the core stack in the setup module. Tip: you can start typing MetricsQueue into the field to find the queue.
  - Choose Next.
![Target Configuration](/advanced-metrics-sqs-dynamodb-3.png)

6. In Step 4 of the wizard, choose **Next**.

7. In Step 5 of the wizard, check that the *Define rule detail* panel that the *Event bus* is `Serverlesspresso`. Choose **Create rule**.

## Testing

### Step-by-step instructions
8. Single Order Test
   - Create a new order. 
   - Check the `serverlesspresso-metrics-table`
   - ![Workflow Architecture](/advanced-metrics-sqs-dynamodb-4.png)
   - You’ll see 2 items: (Similar to screenshot above)
       - 2022-XX-XX#TotalSales
       - 2022-XX-XX#ItemName
   - These values are incremented each time there’s an `OrderManager.WaitingCompletion` event in the Event Bus.
9. Load Testing
  - We’ll now use a Lambda function to simulate a large number of orders and see how SQS can act as a buffer for event processing during traffic spikes.
  - These events will be matched with the WaitingCompletion rule and sent to the MetricsQueue.
  - Before you run the load test, let's look at how Lambda will process messages off the queue.
  - Each invocation of the Lambda function will process the events in batches of up to 10 records or windows of 30 seconds. Reserved Concurrency defines how many concurrent Lambda executions would read messages off the queue, the default is up to 1000 concurrent executions at any given time. By using Reserved Concurrency, we’re saying there should only be 1 concurrent execution of this specific Lambda function. 
  - You can customize the ReservedConcurrentExecutions, BatchSize, and MaximumBatchingWindowInSeconds values to adjust how many records are processed at any given time, our current configuration means we'll process up to 10 records per Lambda execution.
  - You can check the serverless-order-metrics table items to see the metrics as they’re updated during the load test. You'll see four metrics; counts for each item type and a total order count. 
  - Navigate to the Lambda console and search for the `EventsLoadTest` Lambda function
  - ![Lambda Console Search](/advanced-metrics-sqs-dynamodb-5.png)
  - Invoke the `EventsLoadTest` Lambda function to simulate `OrderManager.WaitingCompletion` events in the Event Bus by clicking on the orange Test button.
  - ![Invoke Lambda Function](/advanced-metrics-sqs-dynamodb-6.png)
  - You will be prompted to create a test event.
  - For the Event Name, enter *Test*
  - For the Event JSON, you can use the default value.
  - ![Lambda Test Event](/advanced-metrics-sqs-dynamodb-7.png)
  - Click Save, then click on the orange Test button again to execute the load test.
10. Viewing Load Test Results:
- Open up the `PublishMetrics` Lambda function and navigate to the `Monitoring` tab. Expand the `PublishMetrics` function Invocations graph and select "Maximum" instead of "Sum". You'll see only 1 concurrent execution during the load test. Instead of scaling to process all the messages in the SQS Queue, Reserved Concurrency limited the function to only 1 concurrent execution.
- Check the `serverlesspresso-metrics-table` table items.
   - You’ll see around around 500 total orders were simulated during the load test.
- ![Invocations Graph](/advanced-metrics-sqs-dynamodb-8.png)
- Open up the`serverlesspresso-metrics-table` DynamoDB table and navigate to the `Monitor` tab. Expand the Write usage graph and select "Maximum" instead of "Sum". The Red line represents the provisioned capacity for the table whereas the blue line represents how many WCU's were consumed by the `PublishMetrics` function. Without the Reserved Concurrency configuration and SQS queue in place, the Lambda function would’ve scaled to many concurrent executions, consumed all of the Provisioned Write Capacity, and been throttled by the DynamoDB table as it tried to insert metrics.
- ![WCU Graph](/advanced-metrics-sqs-dynamodb-9.png)

## Takeaways
- We were able to provide business metrics for the investors by setting up a new rule and microservice without needing to modify the existing application stack. 
- Using SQS as a buffer between the Event Bus and Lambda prevents database throttling when updating downstream systems like DynamoDB.
- Using Cloudwatch metrics to assess the performance of your event driven design can help identify weak points in your architecture.