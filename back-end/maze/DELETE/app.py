import json

# import requests

from decimal import Decimal
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key, Attr
import os


def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb')

    MAZE_TABLE = os.environ.get("MAZE_TABLE")
    STATS_TABLE = os.environ.get("STATS_TABLE")

    maze_table = dynamodb.Table(MAZE_TABLE)
    stats_table = dynamodb.Table(STATS_TABLE)

    event_body = json.loads(event['body'])
    maze_id = event_body['maze_id']
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    print(user_id)

    status_code = 200
    
    try:
        response_maze = maze_table.delete_item(
            Key={
                'maze_id': maze_id,
            },
            ConditionExpression=Attr('user_id').eq(user_id),
        )
        stats_record = stats_table.scan(
            FilterExpression=Attr('maze_id').eq(maze_id))["Items"]

        # deleting multiple records using batch writer
        with stats_table.batch_writer() as batch:
            for stat_record in stats_record:
                run_id = stat_record["run_id"]
                batch.delete_item(Key={'run_id': run_id, })

        response = {
            "maze": "deleted",
            "stats": "deleted"
        }
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
