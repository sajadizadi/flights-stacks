import { Construct } from "@aws-cdk/core";
import * as events from "@aws-cdk/aws-events";

export class EventConstruct extends Construct {
  public eventRule: events.Rule;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.eventRule = new events.Rule(this, "fiveMinuteRule", {
      schedule: events.Schedule.cron({ minute: "0/5" }),
    });
  }
}