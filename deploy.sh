#!/usr/bin/env bash

export CDK_DEPLOY_ACCOUNT='********';
export CDK_REGION_DEFAULT='ap-northeast-1';
CDK_PROFILE=$1
if [[ $# -ge 1 ]]; then
    export CDK_PROFILE
    shift; shift
    npx npm run build
    npx cdk synth
    npx cdk bootstrap "aws://$CDK_DEPLOY_ACCOUNT/$CDK_REGION_DEFAULT" --profile "$CDK_PROFILE"
    npx cdk deploy --watch --profile "$CDK_PROFILE"
    exit $?
else
    echo "Inputs cannot be blank please try again! CDK_PROFILE=${CDK_PROFILE}"
    exit 1
fi