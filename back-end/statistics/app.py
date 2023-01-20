import json

# import requests

from pprint import pprint
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key, Attr
import os


def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')

    TABLE_NAME = os.environ.get("TABLE")
    table = dynamodb.Table(TABLE_NAME)

    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    print(user_id)
    
    response = None
    status_code = 200

    try:
        response = table.scan(FilterExpression=Attr('user_id').eq(user_id))["Items"]
        for ele in response:
            for key in ele:
                print(type(ele[key]))
                if type(ele[key])!=str:
                    ele[key]=int(ele[key])
    except ClientError as e:
        response = e.response['Error']['Message']
        status_code = 400

    return {
        "statusCode": status_code,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        "body": json.dumps(response),
    }


