import json
# import requests
from main import mapf 
from grid import grid_maze
import numpy as np
from datetime import datetime
import boto3
import os
import uuid

def POST_stats_table(maze_id, user_id, execution_cost, execution_time, agents_count, lower_level_solver, timestamp):

    status_code = 200

    try:
        dynamodb = boto3.resource('dynamodb')
        TABLE_NAME = os.environ.get("TABLE")
        table = dynamodb.Table(TABLE_NAME)

        run_id = str(uuid.uuid4())
        user_id = 'x'

        response = table.put_item(
        Item={
                'run_id': run_id,
                'maze_id': maze_id,
                'user_id': user_id,
                'execution_cost':execution_cost,
                'execution_time':execution_time,
                'agents_count': agents_count,
                'lower_level_solver': lower_level_solver,
                'run_timestamp': timestamp
            }
        )
    except:
        status_code = 400

    return status_code


def lambda_handler(event, context):

    # format event for mapf
    event_body = json.loads(event['body'])
    
    agents_data = {}
    # loop through all agents
    for i in range(len(event_body['agent_positions'])):
        data = event_body['agent_positions'][i]
        agents_data[i+1] = list(map(tuple,data))

    grid_maze = event_body['maze']

    print(np.array(grid_maze))
    print(agents_data)

    start = datetime.now()
    maze_solution = mapf(agents_data, grid_maze)
    end = datetime.now()
    time = (end-start).total_seconds()

    agents = 0
    cost = 0
    for key in maze_solution:
        cost+=len(maze_solution[key])-1
        agents +=1

    response_body = {
        "time":time,
        "cost":cost,
        "mazeSolution":maze_solution
    }

    maze_id = event_body['maze_id']
    user_id = 'x'
    execution_cost= cost
    execution_time = time
    agents_count = agents
    lower_level_solver = event_body['lower_level_solver']
    timestamp= start

    status_code = POST_stats_table(maze_id, user_id, execution_cost, execution_time, agents_count, lower_level_solver, timestamp)

    return {
        "statusCode": status_code,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        "body": json.dumps(response_body),
    }
