import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';


export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc: any = new ec2.Vpc(this, 'VpcDemoChobiit', {
      vpcName: 'vpc-demo',
      cidr: '10.0.0.0/16',
      maxAzs: 1,
      natGateways: 1,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'PublicNetwork',
          cidrMask: 24
        },
        {
          cidrMask: 24,
          name: 'Application',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ]
    })

    const igwId: string = vpc.internetGatewayId;

    console.log("igwId", igwId)

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkDemoQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    //
    // console.log("queue==> ", queue)

    const myRole = new iam.Role(this, 'RoleDemoLambda', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role Lambda function create by CDK',
      roleName: `demo_lambda_chobiit`,
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
      ]
    });

    const lambdaDemo = new lambda.Function(this, 'LambdaDemo', {
      functionName: 'lambdaDemo',
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 128,
      vpc,
      role: myRole
    })

    if (lambdaDemo.timeout) {
      new cloudwatch.Alarm(this, `MyAlarm`, {
        metric: lambdaDemo.metricDuration().with({
          statistic: 'Maximum',
        }),
        evaluationPeriods: 1,
        datapointsToAlarm: 1,
        threshold: lambdaDemo.timeout.toMilliseconds(),
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmName: 'lambdaDemo Timeout',
      });
    }
  }
}
