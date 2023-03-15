---
title: Self Hosted
description: Hosting instructions if you're wanting to host the workshop code on your own AWS account
---

{% callout title="Warning!" type="warning" %}
Only complete this section if you would like to run this workshop **in your own account**. If you are participating in an AWS Event using the Event Engine, skip this page and proceed to the next chapter.
{% /callout %}

## 1. Launch the AWS CloudFormation template

This workshop can be run inside your own AWS accounts. To enable you to follow the workshop, we need to set up and configure a number of AWS services. We have made provisioning these services as simple as possible.

{% callout title="Info" %}

By executing these templates, you are taking responsibility for the lifecycle and costs associated with provisioning them. Please follow the **tear-down instructions** to remove all resources from your AWS account once you have finished the workshop to avoid incurring unexpected costs.
{% /callout %}

We will leverage AWS CloudFormation which allows us to codify our infrastructure. Select your preferred region to which you will deploy the template. Just click the Launch link to create the stack in your account.

| Region | Launch stack |
| ------ |:------|
| **US East (N. Virginia)** us-east-1 | {% button href="https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?stackName=serverless-workshop&templateURL=https://ee-assets-prod-us-east-1.s3.amazonaws.com/modules/67b03f2bcecc4fafb15053897585b61f/v1/cloudformationvLatest.yml" %} Launch {% /button %} |





1. Enter a stack name (or just keep the default name)
2. **Check** the boxes in the Capabilities section
3. Click **Create stack**

![Quick create stack](/setup-self-hosted-1.png)