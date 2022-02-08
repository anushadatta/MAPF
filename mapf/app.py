import json
# import requests
from main import mapf 
from grid import grid_maze
import numpy as np
from datetime import datetime

def lambda_handler(event, context):

    # format event for mapf
    event_body = json.loads(event['body'])
    
    agents_data = {}
    # loop through all agents
    for i in range(len(event_body['agentPositions'])):
        data = event_body['agentPositions'][i]
        agents_data[i+1] = list(map(tuple,data))

    grid_maze = event_body['maze']

    print(np.array(grid_maze))
    print(agents_data)

    # start = datetime.now()
    result = mapf(agents_data, grid_maze)
    # end = datetime.now()
    return {
        "statusCode": 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        "body": json.dumps(result),
    }
