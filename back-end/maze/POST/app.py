import json

# import requests

import boto3
import os
import uuid


def lambda_handler(event, context):
    
    # format event for mapf
    event_body = json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')

    TABLE_NAME = os.environ.get("TABLE")
    table = dynamodb.Table(TABLE_NAME)

    maze_id = str(uuid.uuid4())
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    print(user_id)
    maze_name = event_body['maze_name']
    maze_string = event_body['maze_string']

    maze_record = {
        'maze_id': maze_id,
        'user_id': user_id,
        'maze_name': maze_name,
        'maze_string': maze_string
    }

    response = table.put_item(
       Item= maze_record
    )

    response["maze_record"] = maze_record

    return {
        "statusCode": 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        "body": json.dumps(response),
    }
