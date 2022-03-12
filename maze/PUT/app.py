import json

# import requests

from decimal import Decimal
import boto3
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError
import os


def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb')

    TABLE_NAME = os.environ.get("TABLE")
    table = dynamodb.Table(TABLE_NAME)

    event_body = json.loads(event['body'])
    maze_id = event_body['maze_id']
    maze_string = event_body['maze_string']
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    print(user_id)

    status_code = 200

    try: 
        response = table.update_item(
            Key={
                'maze_id': maze_id,
            },
            UpdateExpression="SET maze_string=:x",
            ExpressionAttributeValues={
                ':x': maze_string,
            },
            ConditionExpression=Attr('user_id').eq(user_id),
        )
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

