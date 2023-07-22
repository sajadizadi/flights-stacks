#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from "@aws-cdk/core";
import { SchedulersStack } from '../lib/schedulers-stack';
import * as events from "@aws-cdk/aws-events";


const app = new cdk.App();
new SchedulersStack(app, 'SchedulersStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  srcDestKvp: [
    {
      source: "NRT",
      destination: "BKK",
      schedule: events.Schedule.cron({
        // hour: "11", //7 am
        // hour: "13", //9 am
        hour: "19", //3 pm
        // hour: "1", //9 pm
        
        //minute: "0"
        minute: "32"
      })
    }
    ,
    {
      source: "NRT",
      destination: "ICN",
      schedule: events.Schedule.cron({
        // hour: "11", //7 am
        //hour: "13", //9 am
        hour: "19", //3 pm
        // hour: "1", //9 pm
        
        // minute: "15"
        minute: "37"
      })
    },
    {
      source: "NRT",
      destination: "TPE",
      schedule: events.Schedule.cron({
        // hour: "11", //7 am
        //hour: "13", //9 am
        hour: "19", //3 pm
        // hour: "1", //9 pm
        
        //minute: "30"
        minute: "42"
      })
    }
  ]
});