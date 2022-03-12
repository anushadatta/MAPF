import json

# import requests

from pprint import pprint
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

    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    print(user_id)

    response = None
    status_code = 200

    try:
        maze_response = maze_table.scan(FilterExpression=Attr('user_id').eq(user_id))["Items"]
        
        stats_response = stats_table.scan(FilterExpression=Attr('user_id').eq(user_id))["Items"]
        for ele in stats_response:
            for key in ele:
                print(type(ele[key]))
                if type(ele[key])!=str:
                    ele[key]=int(ele[key])
        response = {
            "mazes":maze_response,
            "statistics":stats_response
        }
        
    except ClientError as e:
        response = e.response['Error']['Message']
        status_code = 400

    return {
        "statusCode": status_code,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        "body": json.dumps(response),
    }


