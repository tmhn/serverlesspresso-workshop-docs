---
title: The Display App
description: An overview of building the Step Functions workflow
---

## Overview

The Display App runs on a monitor above the coffee bar. It provides a list of upcoming and completed drinks. It also shows the QR code that customers scan to start their orders. This is the first of three frontends you will set up.

## Inside this section

This frontend has already been deployed and is presented as a hosted UI at https://workshop-display.serverlesscoffee.com/.

- The hosted UI presents a configuration page when you first visit this URL.
- After entering the configuration settings, it stores these in the browser's local cache.
- The settings you use are not visible to anyone else visiting the same URL.

*Source code for this application:*
* [The Display App ](#)

## Setting up the Display App

### Step-by-step instructions ###

Most of front end configurations have already been entered for you, you must load these by selecting the Display app URL from the Cloud Formation template outputs:

1. From the AWS Management Console, search for "Cloud Formation", then choose "Cloud Formation" from the list of results.
![Settings page](/configuring-frontends-display-app-1.png)

2. From the List of Stacks, select the core stack it should be named something like **mod-67b03f2bcecc4faf**. 

3.Choose the **Outputs** tab.


4. Find Output named *DisplayAppURI* and choose the pre created URL, Open this link in a new tab.
![Settings page](/configuring-frontends-display-app-2.png)

4. This opens the display application UI with all but 2 of the configurations pre-filled.

![Settings page](/configuring-frontends-display-app-3.png)

5. Complete the remaining configuration settings:

- **PoolId**: enter the `poolId` value from [Finding the Settings](/3-web-apps/1-overview.html#finding-the-settings) earlier..
- **Host**: enter the `host` value from [Finding the Settings](/3-web-apps/1-overview.html#finding-the-settings) earlier.

6. Choose **Save and reload**.

![Cognito signin](/configuring-frontends-display-app-4.png)

## Setting up a user account

The Serverlesspresso application supports both user and admin accounts. The admin account can log into the Display and Barista apps, whereas users can only log into the Customer app. In this section, you will create an admin user to log into all apps.

### Step-by-step instructions ###

1. Select the *Create Account* tab. Enter a valid email you have access to during the workshop, together with a password. Choose **Create Account**

![Cognito signin completed](/configuring-frontends-display-app-5.png)

2. Enter the verification code from the email and choose **Confirm**.

![Verification code](/configuring-frontends-display-app-6.png)

3. In a separate browser tab, navigate to the [Cognito console](https://console.aws.amazon.com/cognito/). Choose *ServerlesspressoUserPool*.

![Cognito console](/configuring-frontends-display-app-7.png)

4. Select the *Groups* tab, then choose **Create group**.

![Cognito console](/configuring-frontends-display-app-8.png)

5. In the *Create group* page, enter `admin` for the *Group name* and choose **Create group**.

![Cognito console](/configuring-frontends-display-app-9.png)

6. Select then *Users* tab, then choose the user you created.

![Cognito console](/configuring-frontends-display-app-10.png)

7. In *Group memberships*, choose **Add user to group**. Select *admin* and choose **Add**.

![Cognito console](/configuring-frontends-display-app-11.png)

8. Go back to the browser tab showing the Display App. Log in with the user you created and the the Display App is now shown.

![Display app](/configuring-frontends-display-app-12.png)

Note the 4 admin buttons provided in the top right-hand corner:

* **Configure barista app**: Use this for transferring settings to the Barista App later in this section.
* **Configure order app**: Use this for transferring settings to the Order App later in this section.
* **Clear settings**: Empties the local settings cache and clears the backend settings. This causes the *Settings* page to be displayed the next time the page reloads. Use this if you want to change your backend settings.
* **Sign out**: Signs out the Cognito user from the frontend and returns you to the sign-in page.

The QR code shown will change every five minutes and limit the total number of orders to the value shown on the screen (10 by default). Later, in the end-to-end test, you will scan this QR code to start the ordering process.

Keep the Display App open in a browser tab.

## Next steps

Next, you will set up the Barista App.