import * as cdk from "@aws-cdk/core";
import * as targets from "@aws-cdk/aws-events-targets";
import * as events from "@aws-cdk/aws-events";
import * as lambda from "@aws-cdk/aws-lambda";
import * as ecr from "@aws-cdk/aws-ecr";
import * as iam from "@aws-cdk/aws-iam";
import { Tags } from "@aws-cdk/core";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface SchedulersStackProps extends cdk.StackProps {
  readonly srcDestKvp: SrcDestKvp[];
}

type SrcDestKvp = {
  source: string;
  destination: string;
}

export class SchedulersStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: SchedulersStackProps) {
    super(scope, id, props);

    // const urlCatcher = lambda.Function.fromFunctionArn(
    //   this,
    //   "url-catcher",
    //   "arn:aws:lambda:ap-northeast-1:320169174892:function:url-catcher"
    // );
    const repo = ecr.Repository.fromRepositoryName(this, "repo-id", "flights-finder");
    const role = iam.Role.fromRoleArn(this, "my-role", "arn:aws:iam::320169174892:role/service-role/lambda-role");

    props?.srcDestKvp.forEach(srcDest => {
      const f = new lambda.Function(this, `flights-finder-${srcDest.source}-${srcDest.destination}`, {
        code: lambda.EcrImageCode.fromEcrImage(repo, { tagOrDigest: "latest" }),
        runtime: lambda.Runtime.FROM_IMAGE,
        handler: lambda.Handler.FROM_IMAGE,
        functionName: `flights-finder-${srcDest.source}-${srcDest.destination}`,
        role,
        memorySize: 3000,
        timeout: cdk.Duration.minutes(5),
        environment: {
          "SOURCE": srcDest.source,
          "DESTINATION": srcDest.destination,
          //"LOOK_AHEAD_DAYS": "180"
        },

      });
      Tags.of(scope).add("Purpose", "Flights-Scanner");
      Tags.of(scope).add("Source", srcDest.source);
      Tags.of(scope).add("Destination", srcDest.destination);

      const eventRule = new events.Rule(this, `scheduled-task-${srcDest.source}-${srcDest.destination}`, {
        schedule: events.Schedule.cron({ minute: "0/5" }),
        targets: [new targets.LambdaFunction(f, {
          event: events.RuleTargetInput.fromObject({ /*message: "Hello Lambda"*/ })
        })]
      });
      targets.addLambdaPermission(eventRule, f);
    })

    // const a = new cdk.aws_events.Rule(this, "my-zeroth-scheduled-task", {
    //   description: "Scheduled Lambda",
    //   targets: [new cdk.aws_events_targets.LambdaFunction(urlCatcher)],
    //   schedule: cdk.aws_events.Schedule.cron({
    //     minute: "0",
    //     hour: "11",
    //     day: "*",
    //     month: "*"
    //   })
    // });
    // const c = new C(, "123");
    // new events.Rule(c, "123");

    // new cdk.aws_events.Rule(this, "my-first-scheduled-task", {
    //   description: "Scheduled Lambda",
    //   targets: [new cdk.aws_events_targets.LambdaFunction(urlCatcher)],
    //   schedule: cdk.aws_events.Schedule.cron({
    //     minute: "0",
    //     hour: "12",
    //     day: "*",
    //     month: "*"
    //   })
    // });

    // new cdk.aws_events.Rule(this, "my-second-scheduled-task", {
    //   description: "Scheduled Lambda",
    //   targets: [new cdk.aws_events_targets.LambdaFunction(urlCatcher)],
    //   schedule: cdk.aws_events.Schedule.cron({
    //     minute: "0",
    //     hour: "13",
    //     day: "*",
    //     month: "*"
    //   })
    // });


  }
}