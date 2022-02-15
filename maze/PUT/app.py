import json

# import requests

from decimal import Decimal
import boto3
import os


def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb')

    TABLE_NAME = os.environ.get("TABLE")
    table = dynamodb.Table(TABLE_NAME)

    event_body = json.loads(event['body'])
    maze_id = event_body['maze_id']
    maze_string = event_body['maze_string']

    response = table.update_item(
        Key={
            'maze_id': maze_id,
        },
        UpdateExpression="SET maze_string=:x",
        ExpressionAttributeValues={
            ':x': maze_string,
        },
    )

    return {
        "statusCode": 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        "body": json.dumps(response),
    }

