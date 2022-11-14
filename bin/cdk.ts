#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();

new CdkStack(app, 'CdkDemoStack', {
   env: { account: '831344450728', region: 'ap-northeast-1' },
});