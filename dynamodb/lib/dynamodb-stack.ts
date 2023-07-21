import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Table, TableClass, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DynamodbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoTable = new Table(this, 'DealsTable', {
      tableName: 'Deals',
      partitionKey: {
        name: 'dealDateSrcDest',
        type: AttributeType.STRING
      },
      sortKey: {
        name: "queryDate",
        type: AttributeType.STRING
      },
      encryption: TableEncryption.AWS_MANAGED,
      readCapacity: 5,
      writeCapacity: 5,
      tableClass: TableClass.STANDARD,

      /**
       *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new table, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will delete the table (even if it has data in it)
       */
      removalPolicy: cdk.RemovalPolicy.RETAIN, // NOT recommended for production code
    });
    dynamoTable.autoScaleReadCapacity({ minCapacity: 1, maxCapacity: 10 }).scaleOnUtilization({ targetUtilizationPercent: 75 });
    dynamoTable.autoScaleWriteCapacity({ minCapacity: 1, maxCapacity: 10 }).scaleOnUtilization({ targetUtilizationPercent: 75 });
  }
}
